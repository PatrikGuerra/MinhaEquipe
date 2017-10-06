import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';

import * as firebase from 'firebase';

//Models
import { Usuario } from "../../models/usuario";
import { Credencial } from "../../models/credencial";

//Services
import { AuthServiceProvider } from "../auth-service/auth-service";

import { dataBaseStorage } from "../../app/app.constants";

@Injectable()
export class UsuarioServiceProvider {
  private usuario: FirebaseObjectObservable<Usuario>;

  constructor(
    public db: AngularFireDatabase,
    public storage: Storage,
    private camera: Camera,
    private authProvider: AuthServiceProvider) {

    //this.getuid().then(uid => {
    this.storage.get("uid").then(uid => {
      this.usuario = <FirebaseObjectObservable<Usuario>>this.db.object(`${dataBaseStorage.Usuario}/${uid}`);
    });
  }

  // getuid() {
  //   return this.storage.get("uid");
  // }

  getUser() {
    return this.usuario;
  }

  updateCurrentUser(usuario): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.getUser().subscribe((dataUsuario: Usuario) => {

          let usuarioAtual = this.db.database.ref(`${dataBaseStorage.Usuario}/${dataUsuario.$key}`);
          usuarioAtual.update(usuario).then((data) => {
            resolve(data);
          });
        });

      }
      catch (ex) {
        reject(ex);
      }
    });
  }

  public criarUsuario(email: string, key: string) {
    var usuario: Usuario = new Usuario();
    usuario.email = email;

    let usuarioAtual = this.db.database.ref(`${dataBaseStorage.Usuario}/${key}`);
    return usuarioAtual.set(usuario);
  }

  public atualizarEmail(novoEmail: string, senha: string): Promise<any> {
    return new Promise((resolve, reject) => {
      //this.getuid().then(uid => {
      this.getUser().subscribe((dataUsuario: Usuario) => {
        this.authProvider.reauthenticateWithCredential(senha).then((dataReautenticacao) => {

          this.authProvider.updateEmailAndsendEmailVerification(novoEmail).then((data) => {
            let usuarioAtual = this.db.database.ref(`${dataBaseStorage.Usuario}/${dataUsuario.$key}`);

            usuarioAtual.update(
              { email: novoEmail }
            ).then(function (hue) {
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
      });
      // }).catch((erro: any) => {
      //   console.error("Erro do pegar uid.");
      //   reject(erro);
      // });
    });
  }

  public atualizarSenha(novaSenha: string, senhaAtual: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // this.getuid().then(uid => {
      this.authProvider.reauthenticateWithCredential(senhaAtual).then((dataReautenticacao) => {
        this.authProvider.updatePassword(novaSenha).then((data) => {
          resolve(data);

        }).catch((erro: any) => {
          console.error("Erro ao alterar senha no auth.");
          reject(erro);
        });

      }).catch((erro: any) => {
        console.error("Erro ao reautenticar.");
        reject(erro);
      });

      // }).catch((erro: any) => {
      //   console.error("Erro do pegar uid.");
      //   reject(erro);
      // });

    });
  }
  atualizarImagem(image: string): Promise<any> {
    return new Promise((resolve, reject) => {
      //this.getuid().then(usuarioUid => {
      this.getUser().subscribe((dataUsuario: Usuario) => {
        this.uploadImage(image, dataUsuario.$key).then((firebaseImage: any) => {
          let usuarioAtual = this.db.database.ref(`${dataBaseStorage.Usuario}/${dataUsuario.$key}`);

          usuarioAtual.update(
            { fotoUrl: firebaseImage.downloadURL }
          ).then(function (firebaseImageUpdate) {
            resolve(firebaseImageUpdate);
          }, function (error) {
            reject(error);
          });

        });
      });
      //});
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
  }
  pictureFromLibray() {
    const cameraOptions: CameraOptions = {
      // quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    };

    return this.camera.getPicture(cameraOptions);
  }

}
