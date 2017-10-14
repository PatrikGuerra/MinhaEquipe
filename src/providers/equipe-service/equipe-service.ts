import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';

import * as firebase from 'firebase';

//Services
import { UserServiceProvider } from "../user-service/user-service";

//Models
import { Equipe } from "../../models/equipe";
//import { EquipeConvite } from "../../models/equipeConvite";

import { dataBaseStorage } from "../../app/app.constants";

@Injectable()
export class EquipeServiceProvider {
  //https://stackoverflow.com/questions/39788687/cast-firebaselistobservableany-to-firebaselistobservablemycustomtype?rq=1
  //https://stackoverflow.com/questions/40632308/casting-firebaselistobservable-results-to-objects

  constructor(
    public db: AngularFireDatabase,
    public storage: Storage,
    private camera: Camera,
    private userProvider: UserServiceProvider) {
    console.log('Hello EquipeServiceProvider Provider');
  }

  public getAll(usuarioId: string) {
    //return this.userProvider.getuid().then(uid => {
      // return <FirebaseListObservable<Equipe[]>>

      return this.db.list(`${dataBaseStorage.Equipe}`, {
        query: {
          orderByChild: `membros/${usuarioId}`,
          equalTo: true,
        }
      });
   // });
  }

  getEquipe(key: string) {
    return <FirebaseObjectObservable<Equipe>>this.db.object(`${dataBaseStorage.Equipe}/${key}`);
    // return this.db.object(`${dataBaseStorage.Equipe}/${key}`).subscribe(data => {
    //   return <FirebaseObjectObservable<Equipe>>data;
    // }, (error: any) => {
    //   console.error(error);
    // });
  }


  public remove(key: string) {
    return this.db.database.ref(key).remove();
  }
  public save(equipe: Equipe, key: string, imagem: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userProvider.getuid().then((usuarioUid) => {

        if (!key) {
          //Se é Push
          key = this.db.database.ref(dataBaseStorage.Equipe).push().key;
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
    updates[`${dataBaseStorage.Equipe}/${key}`] = equipe; //equipe
    // /equipes/_UidEquipe_

    updates[`${dataBaseStorage.Usuario}/${equipe.keyResponsavel}/equipes/${key}`] = true; //Atualiza Usuario administrador
    // /usuarios/_UidUsuario_/equipes/_UidEquipe_

    return this.db.database.ref().update(updates);
  }

  private uploadImage(imageString: string, uid: string): Promise<any> {
    let storageRef: any;
    let parseUpload: any;

    return new Promise((resolve, reject) => {
      storageRef = firebase.storage().ref(`${dataBaseStorage.Equipe}/${uid}.jpg`);
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

  /*
  public enviarConvites(convite: EquipeConvite) {
    var updates = {};
    var keyConvite: string = "";

    for (var index = 0; index < convite.emails.length; index++) {
      keyConvite = this.db.database.ref(dataBaseStorage.Convite).push().key;

      updates[`${dataBaseStorage.Convite}/${keyConvite}`] = {
        'email': convite.emails[index],
        'keyEquipe': convite.equipe.$key
      }
    }

    return this.db.database.ref().update(updates)
  }
  */
}
