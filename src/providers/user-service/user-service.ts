import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Observable } from "rxjs/Observable";
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
//import { AngularFire } from 'angularfire2';

import { Storage } from '@ionic/storage';

//Models
import { Usuario } from "../../models/usuario";





@Injectable()
export class UserServiceProvider {
  private basePath: string = '/usuarios';
  //usuario: FirebaseObjectObservable<any>
  usuario: any
  
  constructor(
    public db: AngularFireDatabase,
    public storage: Storage) {


  }


  getuid() {
    return this.storage.get("uid");
  }


  getUser() {
    // Getting UID of Logged In User
    return this.getuid().then(uid => {
      return this.db.object(`/usuarios/${uid}`);
    });
  }


 /* getCurrentUser() {
    this.getuid().then(uid => {
      this.usuario = this.db.object(`/usuarios/${uid}`, { preserveSnapshot: true });
      console.log(this.usuario);

      this.usuario.subscribe(snapshot => {
        console.log(snapshot.key)
        console.log(snapshot.val())
        return snapshot.val();
      });
    })
  }*/

  updateCurrentUser(usuario: Usuario) {
    this.getuid().then(uid => {
      let usuarioAtual = this.db.database.ref(`/usuarios/${uid}`);
      usuarioAtual.update(usuario);
    });
  }

  updateImageCurrentUser() {

  }

/*
  getItem(key: string): FirebaseObjectObservable<Usuario> {
    const itemPath =  `${this.basePath}/${key}`;
    this.usuario = this.db.object(itemPath)
    return this.usuario
  }

*/

  criarUsuario(data) {
    let uid = data.uid;

    let usuario = new Usuario();
    usuario.email = data.email;
    usuario.nome = data.email;
    usuario.fotoUrl = "https://firebase.google.com/?hl=pt-br";
    console.log(data)
    let usuarioAtual = this.db.database.ref(`/usuarios/${uid}`);
    usuarioAtual.set(usuario);
  }
/*
  atualizarUsuario(usuario: Usuario) {
    this.getuid().then(uid => {
      let usuarioAtual = this.db.database.ref(`/usuarios/${uid}`);
      usuarioAtual.update(usuario);
    })
  }

  pegarUsuarios() {
    return this.usuario;
  }

  getUsuario() {
    return this.usuario;
  }
*/
}
