import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { dataBaseStorage } from "../../app/app.constants";

//Service
import { UserServiceProvider } from "../user-service/user-service";

@Injectable()
export class ChatServiceProvider {
  constructor(
    public db: AngularFireDatabase,
    public userService: UserServiceProvider) {
  }

  // Este método retorna um objeto do tipo "Mensagem" e então é 
  // criado a propriedade "usuario" que contem o objeto de 
  // usuario buscado
  getMessages(keyEquipe: string) {
    return this.db.list(`${dataBaseStorage.Chat}/${keyEquipe}`)
      .map(mensagens => mensagens.map((item) => {
        item.day = new Date(item.timestamp || Date.now()).getDate();

        if (item.keyUsuario) {
          item.usuario = this.userService.getUsuario(item.keyUsuario);
        }

        return item;
      }));
  }

  /*
  getLastMessages(keyEquipe: string, count: number = 5) {
    return this.db.list(`${dataBaseStorage.Chat}/${keyEquipe}`, {
      query: {
        limitToLast: count,
        orderByPriority: true
      }
    }).subscribe(data => {
      data.map(messages => messages.reverse().map((item) => {
        if (item.keyUsuario) {
          item.usuario = this.userService.getUsuario(item.keyUsuario);
        }

        return item;
      }));
    })
  }
  */

  sendMessage(usuarioId: string, conteudo: string, equipeId: string) {
    var mensagem = new Mensagem(usuarioId, conteudo);

    return this.db.list(`${dataBaseStorage.Chat}/${equipeId}`).push(mensagem);
  }
}

export class Mensagem {
  public constructor(usuarioRemetenteId: string, conteudo: string) {
    this.keyUsuario = usuarioRemetenteId;
    this.conteudo = conteudo;
    this.timestamp = firebase.database.ServerValue.TIMESTAMP;
  }

  keyUsuario: string;
  conteudo: string;
  timestamp?: string | Object;
}