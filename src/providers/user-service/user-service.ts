import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Observable } from "rxjs/Observable";
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
//import { AngularFire } from 'angularfire2';

import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
//Models
import { Usuario } from "../../models/usuario";

import { Camera, CameraOptions } from '@ionic-native/camera';

import { AuthServiceProvider } from "../auth-service/auth-service";

@Injectable()
export class UserServiceProvider {
  private basePath: string = '/usuarios';
  usuario: any

  firebaseStorage = firebase.storage();
  constructor(
    public db: AngularFireDatabase,
    public storage: Storage,
    private camera: Camera,
    private authProvider: AuthServiceProvider) {
  }


  getuid() {
    return this.storage.get("uid");
  }

  getUser() {
    return this.getuid().then(uid => {
      return this.db.object(`${this.basePath}/${uid}`);
    });
  }

  updateCurrentUser(usuario): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.getuid().then(uid => {
          let usuarioAtual = this.db.database.ref(`${this.basePath}/${uid}`);
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

  criarUsuario(data) {
    let uid = data.uid;

    let usuario = new Usuario();
    usuario.email = data.email;
    usuario.nome = data.email;
    usuario.fotoUrl = "";
    console.log(data)
    let usuarioAtual = this.db.database.ref(`${this.basePath}/${uid}`);
    usuarioAtual.set(usuario);
  }


  uploadImage(imageString: string, uid: string): Promise<any> {
    let image: string = `${this.basePath}/${uid}.jpg`;
    let storageRef: any;
    let parseUpload: any;

    return new Promise((resolve, reject) => {
      storageRef = firebase.storage().ref('posters/' + image);
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

  atualizarEmail(novoEmail: string, senha: string): Promise<any> {
    return new Promise((resolve, reject) => {
      
      this.getuid().then(uid => {
        this.authProvider.reauthenticateWithCredential(senha).then((dataReautenticacao) => {

          this.authProvider.updateEmailAndsendEmailVerification(novoEmail).then((data) => {
            let usuarioAtual = this.db.database.ref(`${this.basePath}/${uid}`);

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
        
      }).catch((erro: any) => {
        console.error("Erro do pegar uid.");
        reject(erro);
      });;
    });
  }

  atualizarImagem(image: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getuid().then(uid => {
        this.uploadImage(image, uid).then((snapshot: any) => {
          let usuarioAtual = this.db.database.ref(`${this.basePath}/${uid}`);

          usuarioAtual.update(
            { fotoUrl: snapshot.downloadURL }
          ).then(function (hue) {
            resolve(hue);
          }, function (error) {
            reject(error);
          });
        });

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
