import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Observable } from "rxjs/Observable";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from 'firebase/app';


@Injectable()
export class AuthServiceProvider {
  user: Observable<firebase.User>;

  constructor(private angularFireAuth: AngularFireAuth) {
    this.user = angularFireAuth.authState;
    console.log('AuthServiceProvider -- inicializado');
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

  updateEmailAndsendEmailVerification(novoEmail) {
    //https://firebase.google.com/docs/reference/js/firebase.User#updateEmail

    return new Promise((resolve, reject) => {
      try {
        this.angularFireAuth.auth.currentUser.updateEmail(novoEmail).then((data) => {
          this.angularFireAuth.auth.currentUser.sendEmailVerification().then((dataEmail) => {
            resolve(dataEmail);
          })
        })
      } 
      catch (ex) {
        reject(ex);
      }
    });
  }

  reauthenticateWithCredential(senha) {
    //https://stackoverflow.com/questions/45163737/firebase-auth-reauthenticate-is-not-a-function
    //https://firebase.google.com/docs/reference/js/firebase.User#reauthenticateWithCredential

    var user = firebase.auth().currentUser;
    var credentials = firebase.auth.EmailAuthProvider.credential(user.email, senha);
    return this.angularFireAuth.auth.currentUser.reauthenticateWithCredential(credentials);
  }

  sendEmailVerification() {
    return this.angularFireAuth.auth.currentUser.sendEmailVerification();
  }
}
