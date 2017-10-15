import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import * as firebase from 'firebase/app';
import { dataBaseStorage } from "../../app/app.constants";

//Services
import { UserServiceProvider } from "../user-service/user-service";

//Models
import { Usuario } from "../../models/usuario";
import { ChatMensagemData } from './../../models/data/chatMensagemData';

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
          this.userService.getUsuario(item.keyUsuario).subscribe(data => {
            item.usuario = <FirebaseObjectObservable<Usuario>>data;
          });
        }

        return item;
      }));
  }


  getLastMessages(equipeId: string, count: number = 5) {
    return this.db.list(`${dataBaseStorage.Chat}/${equipeId}`, {
      query: {
        limitToLast: count,
        orderByPriority: true
      }
    }).subscribe(data => {
      data.map(messages => messages.reverse().map((item) => {
        if (item.keyUsuario) {
          this.userService.getUsuario(item.keyUsuario).subscribe(data => {
            item.usuario = <FirebaseObjectObservable<Usuario>>data;
          });
        }

        return item;
      }));
    })
  }

  sendMessage(usuarioId: string, conteudo: string, equipeId: string) {
    var mensagem = new ChatMensagemData(usuarioId, conteudo);
    return this.db.list(`${dataBaseStorage.Chat}/${equipeId}`).push(mensagem);
  }
}