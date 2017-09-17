import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Observable } from "rxjs/Observable";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//import { AngularFire } from 'angularfire2';

import { Storage } from '@ionic/storage';

//Models
import { Usuario } from "../../models/usuario";

/*
  Generated class for the UserServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserServiceProvider {
  // user: Observable<firebase.User>;

  constructor(
    public afDataBase: AngularFireDatabase,
    private storage: Storage) {
    // this.user = angularFireAuth.authState;
    console.log('Hello UserServiceProvider Provider');
  }

  getUuid() {
    return this.storage.get("uuid")
  }

  criarUsuario(data) {
    let uuid = data.uid;

    let usuario = new Usuario();
    usuario.email = data.email;
    usuario.nome = data.email;
    usuario.fotoUrl = "https://firebase.google.com/?hl=pt-br";
    console.log(data)
    let usuarioAtual = this.afDataBase.database.ref(`/usuarios/${uuid}`);
    usuarioAtual.set(usuario);
  }

  atualizarUsuario(usuario: Usuario) {
    this.getUuid().then(uuid => {
      let usuarioAtual = this.afDataBase.database.ref(`/usuarios/${uuid}`);
      usuarioAtual.update(usuario);
    })
  }


  
}
