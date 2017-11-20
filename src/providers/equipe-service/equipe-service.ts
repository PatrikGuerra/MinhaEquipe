import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { dataBaseStorage } from "../../app/app.constants";

import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';

import * as firebase from 'firebase';

//Services
import { UsuarioServiceProvider } from "../usuario-service/usuario-service";

//Models
import { Equipe } from "../../models/equipe";


@Injectable()
export class EquipeServiceProvider {
  //https://stackoverflow.com/questions/39788687/cast-firebaselistobservableany-to-firebaselistobservablemycustomtype?rq=1
  //https://stackoverflow.com/questions/40632308/casting-firebaselistobservable-results-to-objects

  constructor(
    public db: AngularFireDatabase,
    public storage: Storage,
    private camera: Camera,
    private userService: UsuarioServiceProvider) {
    console.log('Hello EquipeServiceProvider Provider');
  }

  private firebaseToEquipe(objeto: any) {
    let equipe: Equipe = Object.assign(new Equipe(), JSON.parse(JSON.stringify(objeto)))
    equipe.$key = objeto.$key;
    equipe.dataFim = new Date(objeto.dataFim);
    equipe.dataInicio = new Date(objeto.dataInicio);

    return equipe;
  }

  public getAll(usuarioId: string) {

    // var query = firebase.database().ref(dataBaseStorage.Equipe).orderByChild( `keyMembros/${usuarioId}`).equalTo(true);
    // return query.once("value").then(snapshot => {
    //   console.log(snapshot)

    //     snapshot.forEach(childSnapshot=> {

    //       var key = childSnapshot.key; // "ada"
    //       console.log(childSnapshot.key)
    //       console.log(childSnapshot.val())

    //       console.log(childSnapshot.val())

    //       console.log(Object.assign(new Equipe(), JSON.parse(JSON.stringify(childSnapshot.val()))))

    //       // childSnapshot.value
    //       // Cancel enumeration
    //       return true;
    //   });
    // });



    return <FirebaseListObservable<Equipe[]>>this.db.list(`${dataBaseStorage.Equipe}`, {
      query: {
        orderByChild: `keyMembros/${usuarioId}`,
        equalTo: true,
      }
    }).map((items) => {
      return items.map(item => {
        return this.firebaseToEquipe(item);
      });
    });
  }

  getEquipe(key: string) {
    return this.db.object(`${dataBaseStorage.Equipe}/${key}`).map((item) => {
      return this.firebaseToEquipe(item);
    });
  }

  public remove(key: string) {
    return this.db.database.ref(key).remove();
  }

  public save(equipe: Equipe, imagem: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.getuid().then((usuarioUid) => {

        if (!equipe.$key) {
          //Se é Push
          equipe.$key = this.db.database.ref(dataBaseStorage.Equipe).push().key;
          equipe.keyResponsavel = usuarioUid;
          equipe.addMembro(usuarioUid);
          equipe.timestamp = firebase.database.ServerValue.TIMESTAMP;
        }

        if (imagem) {
          this.uploadImage(imagem, equipe.$key).then((imageSnapshot: any) => {
            equipe.fotoUrl = imageSnapshot.downloadURL;

            this.update(equipe).then((dataEquipePush) => {
              resolve(dataEquipePush);
            }).catch((error) => {
              reject(error);
            });

          }).catch((error) => {
            reject(error);
          });
        } else {
          this.update(equipe).then((dataEquipePush) => {
            resolve(dataEquipePush);
          }).catch((error) => {
            reject(error);
          });
        }

      });
    });
  }
  private update(equipe: Equipe) {
    var updates = {};

    updates[`${dataBaseStorage.Equipe}/${equipe.$key}`] = {
      'timestamp': equipe.timestamp,
      'dataInicio': equipe.dataInicio,
      'dataFim': equipe.dataFim,
      'nome': equipe.nome,
      'fotoUrl': equipe.fotoUrl,
      'keyResponsavel': equipe.keyResponsavel,
      'keyMembros': equipe.keyMembros,
    };
    // /equipes/_UidEquipe_

    updates[`${dataBaseStorage.Usuario}/${equipe.keyResponsavel}/equipes/${equipe.$key}`] = true; //Atualiza Usuario administrador
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
      targetHeight: 500,
      targetWidth: 500,
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
      targetHeight: 500,
      targetWidth: 500,
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
