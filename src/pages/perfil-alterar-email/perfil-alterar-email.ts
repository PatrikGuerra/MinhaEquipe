import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';

//Service
import { UserServiceProvider } from "../../providers/user-service/user-service";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

//Pages
import { LoginPage } from "../login/login";

@Component({
  selector: 'page-perfil-alterar-email',
  templateUrl: 'perfil-alterar-email.html',
})
export class PerfilAlterarEmailPage {
  alterarEmailForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private userService: UserServiceProvider,
    private authService: AuthServiceProvider) {

    this.alterarEmailForm = formBuilder.group({
      novoEmail: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilAlterarEmailPage');
  }

  cancelar() {
    this.viewCtrl.dismiss();
  }

  alterarEmail() {
    let loading = this.loadingCtrl.create({
      content: 'Alterando e-mail...'
    });

    let alert = this.alertCtrl.create({
      buttons: ['Ok']
    });

    loading.present();

    var novoEmail = this.alterarEmailForm.value.novoEmail;
    var senha = this.alterarEmailForm.value.password;

    this.userService.atualizarEmail(novoEmail, senha).then((data) => {
      alert.setMessage("Você irá receber um e-mail solicitando confirmação de seu endereço.");

      loading.dismiss();

      alert.onDidDismiss((data) => {
        this.authService.sair().then(dataSair => {
          this.navCtrl.setRoot(LoginPage);
        });
      });

      alert.present();

    }).catch((error: any) => {
      console.error(error);

      //authService.reauthenticateWithCredential()
      if (error.code == 'auth/user-mismatch') {
        alert.setMessage("Thrown if the credential given does not correspond to the user.");
      } else if (error.code == 'auth/user-not-found') {
        alert.setMessage("Thrown if the credential given does not correspond to any existing user.");
      } else if (error.code == 'auth/invalid-credential') {
        alert.setMessage("Thrown if the provider's credential is not valid. This can happen if it has already expired when calling link, or if it used invalid token(s). See the Firebase documentation for your provider, and make sure you pass in the correct parameters to the credential method.");
      } else if (error.code == 'auth/invalid-email') {
        alert.setMessage("Thrown if the email used in a firebase.auth.EmailAuthProvider#credential is invalid.");
      } else if (error.code == 'auth/wrong-password') {
        console.error("Thrown if the password used in a firebase.auth.EmailAuthProvider#credential is not correct or when the user associated with the email does not have a password.");
        alert.setMessage("A senha informada não corresponde.");
      } else if (error.code == 'auth/invalid-verification-code') {
        alert.setMessage("Thrown if the credential is a firebase.auth.PhoneAuthProvider#credential and the verification code of the credential is not valid.");
      } else if (error.code == 'auth/invalid-verification-id') {
        alert.setMessage("Thrown if the credential is a firebase.auth.PhoneAuthProvider#credential and the verification ID of the credential is not valid.");
      }

      //authService.updateEmail
      if (error.code == 'auth/invalid-email') {
        console.error("Thrown if the email used is invalid.");
        alert.setMessage('O e-mail digitado não é valido.');
      } else if (error.code == 'auth/email-already-in-use') {
        console.error("Thrown if the email is already used by another user.");
        alert.setMessage('O e-mail digitado já está em uso.');
      } else if (error.code == 'auth/requires-recent-login') {
        console.error("Thrown if the user's last sign-in time does not meet the security threshold. Use firebase.User#reauthenticateWithCredential to resolve. This does not apply if the user is anonymous");
        alert.setMessage("É necessário relogar.");
      }

      loading.dismiss();
      alert.present();
    });
  }
}
