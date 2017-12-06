import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';

import * as firebase from 'firebase/app';
import { dataBaseStorage } from "../../app/app.constants";

//Models
import { Mensagem } from "../../models/mensagem";
import { MensagemTipo } from "../../app/app.constants";

@Injectable()
export class ChatServiceProvider {
  private enumMensagemTipo = MensagemTipo; //https://github.com/angular/angular/issues/2885

  constructor(public db: AngularFireDatabase) {
  }

  private firebaseToMensagem(objeto: any) {
    console.log(objeto)
    let mensagem: Mensagem = Object.assign(new Mensagem(), JSON.parse(JSON.stringify(objeto)))
    mensagem.$key = objeto.$key;
    // mensagem.dia = new Date(mensagem.timestamp || Date.now()).getDate();
    mensagem.dia = new Date(mensagem.timestamp);
    
    return mensagem;
  }

  // Este método retorna um objeto do tipo "Mensagem" e então é 
  // criado a propriedade "usuario" que contem o objeto de 
  // usuario buscado
  public getMensagens(keyEquipe: string) {
    return <FirebaseListObservable<Mensagem[]>>this.db.list(`${dataBaseStorage.Chat}/${keyEquipe}`).map((items) => {
      return items.map(item => {
        return this.firebaseToMensagem(item);
      });
    });
  }

  public getUltimaMensagem(keyEquipe: string) {
    return this.db.list(`${dataBaseStorage.Chat}/${keyEquipe}`, {
      query: {
        limitToLast: 1,
        orderByPriority: true
      }
    }).subscribe(data => {
      data.map(messages => messages.reverse().map((item) => {
        return this.firebaseToMensagem(item);
      }));
    });

    // ou

    // return <FirebaseListObservable<Mensagem[]>>this.db.list(`${dataBaseStorage.Chat}/${keyEquipe}`, {
    //   query: {
    //     limitToLast: count,
    //     orderByPriority: true
    //   }
    // }).map((items) => {
    //   return items.map(item => {
    //     return this.firebaseToMensagem(item);
    //   });
    // });
  }

  //https://stackoverflow.com/questions/4114095/how-to-revert-git-repository-to-a-previous-commit#answer-21718540
  public enviarMensagem(keyEquipe: string, keyUsuario: string, mensagemTipo: MensagemTipo, conteudo: string) {
    if (mensagemTipo == this.enumMensagemTipo.Notificacao) {
      keyUsuario = keyEquipe;
    }

    return this.db.list(`${dataBaseStorage.Chat}/${keyEquipe}`).push({
      'keyUsuario': keyUsuario,
      'conteudo': conteudo,
      'timestamp': firebase.database.ServerValue.TIMESTAMP,
      'tipo': mensagemTipo
    });
  }
}