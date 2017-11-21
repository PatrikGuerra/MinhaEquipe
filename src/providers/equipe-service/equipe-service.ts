import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import * as firebase from 'firebase';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { dataBaseStorage } from "../../app/app.constants";

import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';

//Enums
import { OrigemImagem } from "../../app/app.constants";


//Models
import { Equipe } from "../../models/equipe";


//Services
import { UsuarioServiceProvider } from "../usuario-service/usuario-service";






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

  // public remove(key: string) {
  //   return this.db.database.ref(key).remove();
  // }

  public save(equipe: Equipe, imagem: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.getuid().then((usuarioUid) => {

        if (!equipe.$key) {
          //Se é Push
          equipe.keyResponsavel = usuarioUid;
          equipe.addMembro(usuarioUid);
          equipe.timestamp = firebase.database.ServerValue.TIMESTAMP;

          equipe.$key = this.db.database.ref(dataBaseStorage.Equipe).push({
            'keyResponsavel': equipe.keyResponsavel,
            'timestamp': equipe.timestamp
          }).key;
        }

        this.update(equipe).then((dataEquipePush) => {
          if (imagem) {
            this.atualizarImagem(equipe.$key, imagem).then(dataImagem => {
              resolve(dataEquipePush);
            }).catch((error) => {
              reject(error);
            });
          } else {
            resolve(dataEquipePush);
          }
        }).catch((error) => {
          reject(error);
        });
      });
    });
  }

  private update(equipe: Equipe) {
    var updates = {};

    updates[`${dataBaseStorage.Equipe}/${equipe.$key}`] = {
      // 'timestamp': equipe.timestamp,
      //'keyResponsavel': equipe.keyResponsavel,
      // 'fotoUrl': equipe.fotoUrl,
      'dataInicio': equipe.dataInicio,
      'dataFim': equipe.dataFim,
      'nome': equipe.nome,
      'keyMembros': equipe.keyMembros,
    };
    // /equipes/_UidEquipe_

    updates[`${dataBaseStorage.Usuario}/${equipe.keyResponsavel}/equipes/${equipe.$key}`] = true; //Atualiza Usuario administrador
    // /usuarios/_UidUsuario_/equipes/_UidEquipe_

    return this.db.database.ref().update(updates);
  }



  public atualizarImagem(keyEquipe: string, imageString: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.uploadImageEquipe(keyEquipe, imageString).then((firebaseImage: any) => {
        let equipeAtual = this.db.database.ref(`${dataBaseStorage.Equipe}/${keyEquipe}`);

        equipeAtual.update({
          'fotoUrl': firebaseImage.downloadURL
        }).then(function (firebaseImageUpdate) {
          resolve(firebaseImageUpdate);
        }, function (error) {
          reject(error);
        });

      });
    });
  }

  private uploadImageEquipe(keyEquipe: string, imageString: string): Promise<any> {
    let parseUpload: any;

    return new Promise((resolve, reject) => {
      let storageRef = firebase.storage().ref(`${dataBaseStorage.Equipe}/${keyEquipe}.jpg`);
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

  public getPicture(enumOrigem: OrigemImagem) {
    const cameraOptions: CameraOptions = {
      targetHeight: 500,
      targetWidth: 500,
      // quality: 50, 
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      // sourceType: this.camera.PictureSourceType.CAMERA
      // sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    };

    if (enumOrigem == OrigemImagem.Camera) {
      cameraOptions.sourceType = this.camera.PictureSourceType.CAMERA;
      cameraOptions.quality = 50;
    } else if (enumOrigem == OrigemImagem.Galeria) {
      cameraOptions.sourceType = this.camera.PictureSourceType.SAVEDPHOTOALBUM;
    }

    return this.camera.getPicture(cameraOptions);
  }
}
