import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';

import * as firebase from 'firebase';

//Services
import { UserServiceProvider } from "../user-service/user-service";

//Models
import { Equipe } from "../../models/equipe";
import { EquipeConvite } from "../../models/equipeConvite";

@Injectable()
export class EquipeServiceProvider {
  private basePathEquipes: string = '/equipes';
  private basePathUsuarios: string = '/usuarios';

//https://stackoverflow.com/questions/39788687/cast-firebaselistobservableany-to-firebaselistobservablemycustomtype?rq=1
//https://stackoverflow.com/questions/40632308/casting-firebaselistobservable-results-to-objects

  constructor(
    public db: AngularFireDatabase,
    public storage: Storage,
    private camera: Camera,
    private userProvider: UserServiceProvider) {
    console.log('Hello EquipeServiceProvider Provider');
  }

  public getAll(usuarioUid: string) {
    return this.userProvider.getuid().then(uid => {
      // return <FirebaseListObservable<Equipe[]>>
      
      return this.db.list(`${this.basePathEquipes}`, {
        query: {
          orderByChild: `membros/${usuarioUid}`,
          equalTo: true,
         // orderByKey: true,
        }
      });
    });
  }

  public remove(key: string) {
    return this.db.database.ref(key).remove();
  }
  public save(equipe: Equipe, key: string, imagem: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userProvider.getuid().then((usuarioUid) => {
        
        if (!key) {
          //Se é Push
          key = this.db.database.ref(this.basePathEquipes).push().key;
          equipe.keyResponsavel = usuarioUid;
          equipe.addMembro(usuarioUid);
          equipe.timestamp = firebase.database.ServerValue.TIMESTAMP;
        }

        if (imagem) {
          this.uploadImage(imagem, key).then((imageSnapshot: any) => {
            equipe.fotoUrl = imageSnapshot.downloadURL;

            this.update(equipe, key).then((dataEquipePush) => {
              resolve(dataEquipePush);
            }).catch((error) => {
              reject(error);
            });

          }).catch((error) => {
            reject(error);
          });
        } else {
          this.update(equipe, key).then((dataEquipePush) => {
            resolve(dataEquipePush);
          }).catch((error) => {
            reject(error);
          });
        }

      });
    });
  }
  private update(equipe: Equipe, key: string) {
    var updates = {};
    updates[`${this.basePathEquipes}/${key}`] = equipe; //equipe
    // /equipes/_UidEquipe_

    updates[`${this.basePathUsuarios}/${equipe.keyResponsavel}/equipes/${key}`] = true; //Atualiza Usuario administrador
    // /usuarios/_UidUsuario_/equipes/_UidEquipe_

    return this.db.database.ref().update(updates);
  }

  public enviarConvites(convite: EquipeConvite) {

  }

  private uploadImage(imageString: string, uid: string): Promise<any> {
    let storageRef: any;
    let parseUpload: any;

    return new Promise((resolve, reject) => {
      storageRef = firebase.storage().ref(`${this.basePathEquipes}/${uid}.jpg`);
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
  public pictureFromCamera() {
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
  public pictureFromLibray() {
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
