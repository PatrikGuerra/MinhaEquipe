import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

import * as firebase from 'firebase';
import { dataBaseStorage } from "../../app/app.constants";

import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';

//Models
import { Usuario } from "../../models/usuario";
import { Credencial } from "../../models/credencial";

//Services
import { AuthServiceProvider } from "../auth-service/auth-service";

//Others
import { LocalStorage } from "../../app/app.constants";

import { Geolocation } from '@ionic-native/geolocation';

@Injectable()
export class UsuarioServiceProvider {
  public usuario: Usuario;
  private geolocationSubscription: any;

  constructor(
    public db: AngularFireDatabase,
    public storage: Storage,
    private camera: Camera,
    private authService: AuthServiceProvider,
    private geolocation: Geolocation) {

    console.log('Hello UsuarioServiceProvider Provider');
  }

  public setUsuarioAplicacao(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.object(`${dataBaseStorage.Usuario}/${key}`).map((item) => {
        this.monitorar();
        return this.firebaseToUsuario(item);
      }).subscribe(dataUsuario => {
        this.usuario = dataUsuario;
        resolve(dataUsuario);
      });

    });
  }

  public entrar(credencial: Credencial): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authService.entrar(credencial).then(firebaseUser => {

        this.setUsuarioAplicacao(firebaseUser.uid).then(dataUsuario => {
          this.storage.set(LocalStorage.UsuarioUid, dataUsuario.$key);
          resolve(true);
        });

      }).catch(error => {
        reject(error);
      });
    });
  }


  private monitorar() {
    this.geolocationSubscription = this.geolocation.watchPosition()
      .filter((p) => p.coords !== undefined) //Filter Out Errors
      .subscribe(position => {

        this.atualizarLocalizacao(position);
        console.log(position);
      });
  }

  private atualizarLocalizacao(position: any) {
    var updates = {};

    Object.keys(this.usuario.equipes).forEach(element => {
      updates[`${dataBaseStorage.UsuarioLocalizacao}/${element}/${this.usuario.$key}`] = {
        'lat': position.coords.latitude,
        'lng': position.coords.longitude
      };
    });

    return this.db.database.ref().update(updates);
  }

  private firebaseToUsuario(objeto: any) {
    let usuario: Usuario = Object.assign(new Usuario(), JSON.parse(JSON.stringify(objeto)))
    usuario.$key = objeto.$key;

    return usuario;
  }

  getuid() {
    return this.storage.get("uid");
  }

  getUser() {
    return this.getuid().then(uid => {
      return <FirebaseObjectObservable<Usuario>>this.db.object(`${dataBaseStorage.Usuario}/${uid}`).map((item) => {
        return this.firebaseToUsuario(item);
      })
    });
  }



  public getUsuario(key: string) {
    return this.db.object(`${dataBaseStorage.Usuario}/${key}`);
  }


  public buscarUsuariosPorKey(keysUsuario: string[]) {
    var promises = [];

    keysUsuario.forEach(key => {
      var promise = new Promise((resolve, reject) => {
        return this.getUsuario(key).subscribe((data: Usuario) => {
          resolve(data);
        }, (error: any) => {
          reject(error);
        });
      });

      promises.push(promise);
    });

    return Promise.all(promises);
  }









  //ok
  public getUsuariosPorEquipe(keyEquipe: string) {
    return this.db.list(`${dataBaseStorage.Usuario}`, {
      query: {
        orderByChild: `equipes/${keyEquipe}`,
        equalTo: true
      }
    }).map((items) => {
      console.log(items)
      return items.map(item => {
        return this.firebaseToUsuario(item);
      });
    })
  }

  public getUsuarioByEmail(email: string) {
    return this.db.list(`${dataBaseStorage.Usuario}`, {
      query: {
        orderByChild: `email`,

        equalTo: email
      }
    });
  }

  public save(usuario: Usuario) {
    var dataUsuario = {
      nome: usuario.nome,
      //email: usuario.email,
      fotoUrl: usuario.fotoUrl,
      tags: usuario.tags,
      equipes: usuario.equipes,
    }

    return this.db.database.ref(`${dataBaseStorage.Usuario}/${usuario.$key}`).update(dataUsuario)
  }

  public criarUsuario(key: string, nome: string, email: string) {
    var usuario: Usuario = new Usuario();
    usuario.email = email;
    usuario.nome = nome;

    let usuarioAtual = this.db.database.ref(`${dataBaseStorage.Usuario}/${key}`);
    return usuarioAtual.set(usuario);
  }

  public atualizarEmail(novoEmail: string, senha: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getuid().then(uid => {
        this.authService.reauthenticateWithCredential(senha).then((dataReautenticacao) => {

          this.authService.updateEmailAndsendEmailVerification(novoEmail).then((data) => {
            let usuarioAtual = this.db.database.ref(`${dataBaseStorage.Usuario}/${uid}`);

            usuarioAtual.update({
              email: novoEmail
            }).then(function (hue) {
              resolve(hue);
            }, function (error) {
              console.error("Erro ao alterar email no db.");
              reject(error);
            });

          }).catch((erro: any) => {
            console.error("Erro ao alterar email no auth.");
            reject(erro);
          });

        }).catch((erro: any) => {
          console.error("Erro ao reautenticar.");
          reject(erro);
        });

      }).catch((erro: any) => {
        console.error("Erro do pegar uid.");
        reject(erro);
      });
    });
  }

  public atualizarSenha(novaSenha: string, senhaAtual: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getuid().then(uid => {
        this.authService.reauthenticateWithCredential(senhaAtual).then((dataReautenticacao) => {
          this.authService.updatePassword(novaSenha).then((data) => {
            resolve(data);

          }).catch((erro: any) => {
            console.error("Erro ao alterar senha no auth.");
            reject(erro);
          });

        }).catch((erro: any) => {
          console.error("Erro ao reautenticar.");
          reject(erro);
        });

      }).catch((erro: any) => {
        console.error("Erro do pegar uid.");
        reject(erro);
      });
    });
  }
  atualizarImagem(image: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getuid().then(usuarioUid => {
        this.uploadImage(image, usuarioUid).then((firebaseImage: any) => {
          let usuarioAtual = this.db.database.ref(`${dataBaseStorage.Usuario}/${usuarioUid}`);

          usuarioAtual.update(
            { fotoUrl: firebaseImage.downloadURL }
          ).then(function (firebaseImageUpdate) {
            resolve(firebaseImageUpdate);
          }, function (error) {
            reject(error);
          });

        });
      });
    });
  }

  uploadImage(imageString: string, uid: string): Promise<any> {
    let storageRef: any;
    let parseUpload: any;

    return new Promise((resolve, reject) => {
      storageRef = firebase.storage().ref(`${dataBaseStorage.Usuario}/${uid}.jpg`);
      parseUpload = storageRef.putString(imageString, firebase.storage.StringFormat.DATA_URL);

      parseUpload.on('state_changed', (_snapshot) => {

      },
        (_err) => {
          reject(_err);
        },
        (success) => {
          resolve(parseUpload.snapshot);
        });
    });
  }
  pictureFromCamera() {
    const cameraOptions: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA
    };

    return this.camera.getPicture(cameraOptions);
    /*.then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      var stringzaum = 'data:image/jpeg;base64,' + imageData;
      console.log(stringzaum);
   //   this.captureDataUrl = 
    }, (err) => {
      // Handle error
    });*/
  }
  pictureFromLibray() {
    const cameraOptions: CameraOptions = {
      // quality: 50,
      targetHeight: 500,
      targetWidth: 500,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    };

    return this.camera.getPicture(cameraOptions);
    /*
    .then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      var stringzaum = 'data:image/jpeg;base64,' + imageData;
      console.log(stringzaum);
   //   this.captureDataUrl = 
    }, (err) => {
      // Handle error
    });*/
  }
}
