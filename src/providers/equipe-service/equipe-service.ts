import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import * as firebase from 'firebase';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { dataBaseStorage } from "../../app/app.constants";

import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';

//Enums
import { OrigemImagem } from "../../app/app.constants";
import { MensagemTipo } from "../../app/app.constants";

//Models
import { Equipe } from "../../models/equipe";
import { Usuario } from "../../models/usuario";

//Services
import { UsuarioServiceProvider } from "../usuario-service/usuario-service";
import { ChatServiceProvider } from "../chat-service/chat-service";

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


  public removerMembro(keyEquipe: string, usuario: Usuario): Promise<any> {
    console.log("removerMembro -3")
    return new Promise((resolve, reject) => {
      console.log("removerMembro -2")
      this.removerMembroDaEquipe(keyEquipe, usuario.$key).then(data => {
        console.log("removerMembro -1")

        let chatServiceProvider = new ChatServiceProvider(this.db);
        let mensagem = `'${usuario.nome}' removido`;
        chatServiceProvider.enviarMensagem(keyEquipe, keyEquipe, MensagemTipo.Notificacao, mensagem)

        console.log("removerMembro Final")
        resolve(true);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public sairDaEquipe(keyEquipe: string, ): Promise<any> {
    console.log("sairDaEquipe -3")
    return new Promise((resolve, reject) => {
      console.log("sairDaEquipe -2")
      this.removerMembroDaEquipe(keyEquipe, this.userService.usuario.$key).then(data => {
        console.log("sairDaEquipe -1")

        let chatServiceProvider = new ChatServiceProvider(this.db);
        let mensagem = `'${this.userService.usuario.nome}' saiu`;
        chatServiceProvider.enviarMensagem(keyEquipe, keyEquipe, MensagemTipo.Notificacao, mensagem)

        console.log("sairDaEquipe Final")
        resolve(true);
      }).catch(error => {
        reject(error);
      });
    });
  }

  private removerUsuarioDasTarefas(keyEquipe: string, keyUsuario: string): Promise<any> {
    console.log("removerUsuarioDasTarefas 3")
    return new Promise((resolve, reject) => {
      console.log("removerUsuarioDasTarefas 4")
      this.db.object(`${dataBaseStorage.TarefaResponsavel}/${keyUsuario}/${keyEquipe}`).take(1).subscribe(keyTarefas => {
        console.log("removerUsuarioDasTarefas 5")
        if (keyTarefas.$value === null) {
          console.log("removerUsuarioDasTarefas 6 -- null")
          resolve(true);
        } else {
          Object.keys(keyTarefas).forEach(keyTarefa => {
            console.log("removerUsuarioDasTarefas 6 -- " + keyTarefa)
            //Remove o usuário de cada Tarefa
            this.db.object(`${dataBaseStorage.Tarefa}/${keyEquipe}/${keyTarefa}/keyResponsaveis/${keyUsuario}`).remove();
          });

          resolve(true)
        };
      });
    });
  }

  private removerMembroDaEquipe(keyEquipe: string, keyUsuario: string): Promise<any> {
    console.clear()
    console.log("removerMembroDaEquipe 1")
    return new Promise((resolve, reject) => {
      console.log("removerMembroDaEquipe 2")
      //Exclui o registro de TarefaResponsavel do usuario na equipe
      this.removerUsuarioDasTarefas(keyEquipe, keyUsuario).then(() => {
        console.log("removerMembroDaEquipe 7")

        this.db.object(`${dataBaseStorage.TarefaResponsavel}/${keyUsuario}/${keyEquipe}`).remove().then(() => {
          console.log("removerMembroDaEquipe 8")
          //remove a equipe do usuario
          this.db.object(`${dataBaseStorage.Usuario}/${keyUsuario}/equipes/${keyEquipe}`).remove().then(() => {
            console.log("removerMembroDaEquipe 7")

            //remove o usuario da equipe
            this.db.object(`${dataBaseStorage.Equipe}/${keyEquipe}/keyMembros/${keyUsuario}`).remove().then(() => {
              console.log("removerMembroDaEquipe 10")
              resolve(true);
            }).catch(error => {
              console.error("error 4");
              console.error(error);
              reject(error);
            });

          }).catch(error => {
            console.error("error 3");
            console.error(error);
            reject(error);
          });
        }).catch(error => {
          console.error("error 2");
          console.error(error);
          reject(error);
        });
      }).catch(error => {
        console.error("error 1");
        console.error(error);
        reject(error);
      });
    });
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

  /* Salvar - Modo antigo
    public salvar(equipe: Equipe, imagem: string): Promise<any> {
      return new Promise((resolve, reject) => {
        this.userService.getuid().then((usuarioUid) => {
  
          if (!equipe.$key) {
            //Se é Push
            equipe.keyResponsavel = usuarioUid;
            equipe.addMembro(usuarioUid);
            equipe.timestamp = firebase.database.ServerValue.TIMESTAMP;
  
            equipe.$key = this.db.database.ref(dataBaseStorage.Equipe).push().key;
          }
  
          this.alterar(equipe).then((dataEquipePush) => {
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
  */

  public criar(equipe: Equipe, imagem: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.getuid().then((usuarioUid) => {

        equipe.keyResponsavel = usuarioUid;
        equipe.addMembro(usuarioUid);
        equipe.timestamp = firebase.database.ServerValue.TIMESTAMP;

        equipe.$key = this.db.database.ref(dataBaseStorage.Equipe).push().key;

        this.alterar(equipe).then((dataEquipePush) => {
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

  public alterar(equipe: Equipe) {
    var updates = {};

    updates[`${dataBaseStorage.Equipe}/${equipe.$key}`] = {
      'fotoUrl': equipe.fotoUrl,
      'keyResponsavel': equipe.keyResponsavel,
      'timestamp': equipe.timestamp,
      'dataInicio': equipe.dataInicio,
      'dataFim': equipe.dataFim,
      'nome': equipe.nome,
      'keyMembros': equipe.keyMembros,
    };
    // /equipes/keyEquipe

    updates[`${dataBaseStorage.Usuario}/${equipe.keyResponsavel}/equipes/${equipe.$key}`] = true; //Atualiza Usuario administrador
    // /usuarios/keyUsuario/equipes/keyEquipe

    return this.db.database.ref().update(updates);
  }

  public atualizarImagem(keyEquipe: string, imageString: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.uploadImagemEquipe(keyEquipe, imageString).then((firebaseImage: any) => {
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

  private uploadImagemEquipe(keyEquipe: string, imageString: string): Promise<any> {
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

  public removerImagem(keyEquipe: string): Promise<any> {
    return new Promise((resolve, reject) => {

      this.db.database.ref(`${dataBaseStorage.Equipe}/${keyEquipe}`).update({
        'fotoUrl': ""
      }).then((data) => {
        this.removeImagemEquipe(keyEquipe).then(dataStorage => {
          resolve(true);
        }).catch((error) => {
          reject(error);
        });
      }).catch((error) => {
        reject(error);
      });

    });
  }

  private removeImagemEquipe(uid: string) {
    return firebase.storage().ref(`${dataBaseStorage.Equipe}/${uid}.jpg`).delete();
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
