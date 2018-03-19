import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import * as firebase from 'firebase';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
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
    private usuarioService: UsuarioServiceProvider) {

    console.log('Hello EquipeServiceProvider Provider');
  }

  private firebaseToEquipe(objeto: any) {
    let equipe: Equipe = Object.assign(new Equipe(), JSON.parse(JSON.stringify(objeto)))
    equipe.$key = objeto.$key;
    equipe.dataFim = new Date(objeto.dataFim);
    equipe.dataInicio = new Date(objeto.dataInicio);

    return equipe;
  }


  //DONE
  public adicionarMembroNOVO(keyEquipe: string, keyUsuario: string) {
    let updates = {};

    updates[`${dataBaseStorage.EquipeMembros}/${keyEquipe}/${keyUsuario}`] = true

    return this.db.database.ref().update(updates).then((data) => {
      // // let conteudo = `'${this.usuarioService.getUsuarioAplicacao().nome}' entrou na equipe`;
      // this.chatService.enviarMensagem(convite.keyEquipe, convite.keyEquipe, MensagemTipo.Notificacao, conteudo);

      // return this.excluirConvite(convite.$key).then(excluirConviteData => {
      // return excluirConviteData;
      // });
      return data;
    });
  }













  public removerMembro(keyEquipe: string, usuario: Usuario): Promise<any> {
    return new Promise((resolve, reject) => {
      this.removerMembroDaEquipe(keyEquipe, usuario.$key).then(data => {

        let chatServiceProvider = new ChatServiceProvider(this.db, this.usuarioService);
        chatServiceProvider.enviarMensagemMembroRemovido(keyEquipe, usuario.$key);

        resolve(true);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public sairDaEquipe(keyEquipe: string, ): Promise<any> {
    return new Promise((resolve, reject) => {
      let usuarioAplicacao = this.usuarioService.getUsuarioAplicacao()
      this.removerMembroDaEquipe(keyEquipe, usuarioAplicacao.$key).then(data => {

        let chatServiceProvider = new ChatServiceProvider(this.db, this.usuarioService);
        chatServiceProvider.enviarMensagemMembroSaiu(keyEquipe, usuarioAplicacao.$key);

        resolve(true);
      }).catch(error => {
        reject(error);
      });
    });
  }

  private removerUsuarioDasTarefas(keyEquipe: string, keyUsuario: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.object(`${dataBaseStorage.TarefaResponsavel}/${keyUsuario}/${keyEquipe}`).take(1).subscribe(keyTarefas => {
        if (keyTarefas.$value === null) {
          resolve(true);
        } else {
          Object.keys(keyTarefas).forEach(keyTarefa => {
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
    return new Promise((resolve, reject) => {
      //Exclui o registro de TarefaResponsavel do usuario na equipe
      this.removerUsuarioDasTarefas(keyEquipe, keyUsuario).then(() => {

        this.db.object(`${dataBaseStorage.TarefaResponsavel}/${keyUsuario}/${keyEquipe}`).remove().then(() => {
          //remove a equipe do usuario
          this.db.object(`${dataBaseStorage.Usuario}/${keyUsuario}/equipes/${keyEquipe}`).remove().then(() => {

            //remove o usuario da equipe
            this.db.object(`${dataBaseStorage.Equipe}/${keyEquipe}/keyMembros/${keyUsuario}`).remove().then(() => {
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

    //     snapshot.forEach(childSnapshot=> {

    //       var key = childSnapshot.key; // "ada"



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
        this.usuarioService.getuid().then((usuarioUid) => {
  
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
      this.usuarioService.getuid().then((usuarioUid) => {

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
