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

  public getLocais(keyEquipe: string) {
    return this.db.list(`${dataBaseStorage.Local}/${keyEquipe}`);
  }

  public remove(key: string) {
    return this.db.database.ref(key).remove();
  }

  public save(local: Local, key: string, keyEquipe: string) {
    var ref = this.db.database.ref(`${dataBaseStorage.Local}/${keyEquipe}`);

    if (!key) {
      key = ref.push().key;
      //Envia notificação no chat
    }

    return ref.child(key).update(local);
  }
}
