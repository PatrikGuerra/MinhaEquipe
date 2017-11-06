import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Observable } from "rxjs/Observable";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from 'firebase/app';

//Models
import { Credencial } from "../../models/credencial";

//Providers
import { EmailNaoConfirmadoException } from "../../customError/emailNaoConfirmadoException";

@Injectable()
export class AuthServiceProvider {
  public user: Observable<firebase.User>;

  constructor(private angularFireAuth: AngularFireAuth) {
    this.user = angularFireAuth.authState;
    console.log('AuthServiceProvider -- inicializado');
  }

  criarUsuario(credencial: Credencial) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(credencial.email, credencial.senha);
  }

  public sair() {
    return this.angularFireAuth.auth.signOut();
  }

  public entrar(credencial: Credencial): Promise<any> {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.auth.signInWithEmailAndPassword(credencial.email, credencial.senha).then(firebaseUser => {

        if (!firebaseUser.emailVerified) {
          throw new EmailNaoConfirmadoException("Você deve confirmar seu e-mail.");
        };

        resolve(firebaseUser);
      }).catch(error => {
        if (error instanceof EmailNaoConfirmadoException) {
          this.sair();
        }

        reject(error);
      });
    });
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
      this.angularFireAuth.auth.currentUser.updateEmail(novoEmail).then((data) => {
        this.angularFireAuth.auth.currentUser.sendEmailVerification().then((dataEmail) => {
          resolve(dataEmail);
        }).catch((error) => {
          reject(error);
        });
      }).catch((error) => {
        reject(error);
      });
    });
  }

  updatePassword(novaSenha: string) {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.auth.currentUser.updatePassword(novaSenha).then((data) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  reauthenticateWithCredential(senha) {
    //https://stackoverflow.com/questions/45163737/firebase-auth-reauthenticate-is-not-a-function
    //https://firebase.google.com/docs/reference/js/firebase.User#reauthenticateWithCredential

    var firebaseUse = firebase.auth().currentUser;
    var firebaseCredentials = firebase.auth.EmailAuthProvider.credential(firebaseUse.email, senha);
    return this.angularFireAuth.auth.currentUser.reauthenticateWithCredential(firebaseCredentials);
  }

  sendEmailVerification() {
    return this.angularFireAuth.auth.currentUser.sendEmailVerification();
  }
}
