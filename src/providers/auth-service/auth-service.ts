import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Observable } from "rxjs/Observable";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from 'firebase/app';

//Classes
import { User } from "./user";

@Injectable()
export class AuthServiceProvider {
  user: Observable<firebase.User>;

  //constructor(public http: Http) {
  constructor(private angularFireAuth: AngularFireAuth) {
    this.user = angularFireAuth.authState;
    console.log('AuthServiceProvider -- inicializado');
   // console.log(angularFireAuth.authState);
  }

        criarUsuario(credencial) {
          return this.angularFireAuth.auth.createUserWithEmailAndPassword(credencial.email, credencial.password);
        }

  sair() {
    return this.angularFireAuth.auth.signOut();
  }

        entrar(credencial) {
          return this.angularFireAuth.auth.signInWithEmailAndPassword(credencial.email, credencial.password);
        }

        esqueciSenha(email: string) {
          return this.angularFireAuth.auth.sendPasswordResetEmail(email);
        }

  pegaUsuario() {
    return this.angularFireAuth.auth.currentUser;
  }

}
