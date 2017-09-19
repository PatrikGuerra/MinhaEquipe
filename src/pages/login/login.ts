import { Component, ViewChild } from '@angular/core';
import {  NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';

import { Storage } from '@ionic/storage';

//Pages
import { CadastroPage } from "../cadastro/cadastro";
import { EsqueciSenhaPage } from "../esqueci-senha/esqueci-senha";
import { HomePage } from "../home/home";

//Providers
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

//@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private authService: AuthServiceProvider,
    public storage: Storage,
    public formBuilder: FormBuilder) {

    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    console.log(this.storage.get("uuid"))


    this.storage.get("uuid").then(uuid => {
      console.log(uuid)
    })
  }

  criarConta() {
    this.navCtrl.push(CadastroPage);
  }

  esqueciSenha() {
    this.navCtrl.push(EsqueciSenhaPage);
  }

  entrar() {
    let credenciais = this.loginForm.value;
    let toast = this.toastCtrl.create({ position: 'bottom' });

    this.authService.entrar(credenciais).then((data) => {

      
      if (!data.emailVerified) {
        toast.setMessage("Você deve confirmar seu e-mail.");
        toast.setShowCloseButton(true);
        toast.present();

        this.authService.sair();
      } else {
        this.storage.set('uid', data.uid);
        console.log("uid")
        console.log(this.storage.get("uid"))

        this.navCtrl.setRoot(HomePage);
      }
    })
      .catch((error: any) => {
        toast.setDuration(3000);

        if (error.code == 'auth/invalid-email') {
          toast.setMessage('O e-mail digitado não é valido.');
        } else if (error.code == 'auth/user-disabled') {
          toast.setMessage('O usuário está desativado.');
        } else if (error.code == 'auth/user-not-found') {
          toast.setMessage('O usuário não foi encontrado.');
        } else if (error.code == 'auth/wrong-password') {
          toast.setMessage('A senha digitada não é valida.');
        }

        toast.present();
      });
  }

  verificarConfirmacaoDeEmail() {
    var currentUser = this.authService.pegaUsuario();
  }

}
