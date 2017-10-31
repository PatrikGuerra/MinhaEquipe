import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import * as firebase from 'firebase/app';
import { dataBaseStorage } from "../../app/app.constants";

//Models
import { Local } from "../../models/local";

import { ChatServiceProvider } from "../chat-service/chat-service";

@Injectable()
export class LocalServiceProvider {
  constructor(
    public db: AngularFireDatabase,
    private chatService: ChatServiceProvider) {
  }

  private firebaseToLocal(objeto: any) {
    let loacl: Local = Object.assign(new Local(), JSON.parse(JSON.stringify(objeto)))
    loacl.$key = objeto.$key;

    return loacl;
  }

  public getLocal(keyEquipe: string, keyLocal: string) {
    return this.db.object(`${dataBaseStorage.Local}/${keyEquipe}/${keyLocal}`).map(item => {
      return this.firebaseToLocal(item);
    });
  }

  public getLocaisPorEquipe(keyEquipe: string) {
    return this.db.list(`${dataBaseStorage.Local}/${keyEquipe}`).map((items) => {
      return items.map(item => {
        return this.firebaseToLocal(item);
      });
    })
  }

  public remove(key: string) {
    //Tarefa Service
    //getTarefasPorLocalId(keyEquipe: string, keyLocal: string)
    return this.db.database.ref(`${dataBaseStorage.Local}/${key}`).remove();
  }

  public save(local: Local, keyEquipe: string) {
    var ref = this.db.database.ref(`${dataBaseStorage.Local}/${keyEquipe}`);

    if (!local.$key) {
      local.$key = ref.push().key;
      //Envia notificação no chat
    }

    return ref.child(local.$key).update({
      'nome': local.nome,
      'descricao': local.descricao,
      'coordenadas': local.coordenadas,
    });
  }
}
