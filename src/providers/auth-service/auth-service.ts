import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Observable } from "rxjs/Observable";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from 'firebase/app';

//Classes
import { User } from "./user";

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
  user: Observable<firebase.User>;

  //constructor(public http: Http) {
  constructor(private angularFireAuth: AngularFireAuth) {
    this.user = angularFireAuth.authState;
    console.log('AuthServiceProvider -- inicializado');
  }

  criarUsuario(user: User) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(user.email, user.senha);
  }

  sair() {
    return this.angularFireAuth.auth.signOut();
  }

  entrar(user: User) {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(user.email, user.senha);
  }

  esqueciSenha(email: string) {
    return this.angularFireAuth.auth.sendPasswordResetEmail(email);
  }

  pegaUsuario() {
    return this.angularFireAuth.auth.currentUser;
  }

}
