import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';


//import { Component } from '@angular/core';
//import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//Pages
import { CadastroPage } from "../cadastro/cadastro";
import { EsqueciSenhaPage } from "../esqueci-senha/esqueci-senha";
import { HomePage } from "../home/home";

//Classes
import { User } from "../../providers/auth-service/user";

//Providers
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
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
    private storage: Storage,
    public formBuilder: FormBuilder) {

    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
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
