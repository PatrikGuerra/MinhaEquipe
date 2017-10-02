import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

//Pages
import { CadastroPage } from "../cadastro/cadastro";
import { EsqueciSenhaPage } from "../esqueci-senha/esqueci-senha";
import { HomePage } from "../home/home";

//Providers
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

//Models
import { Credencial } from "../../models/credencial";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  private credencial: Credencial = new Credencial();
  private storageLoginEmail: string = "loginEmail";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    public storage: Storage,
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private authService: AuthServiceProvider) {

    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      senha: ['', Validators.compose([Validators.required])]
    });

    this.storage.get(this.storageLoginEmail).then((credencialEmail) => {
      if (credencialEmail) {
        this.credencial.email = credencialEmail;
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  private criarConta() {
    this.navCtrl.push(CadastroPage);
  }

  private esqueciSenha() {
    this.navCtrl.push(EsqueciSenhaPage);
  }

  private entrar() {
    let toast = this.toastCtrl.create({
       position: 'bottom',
       dismissOnPageChange: true
      });

    let loading = this.loadingCtrl.create({
      content: 'Autenticando...'
    });

    loading.present();

    this.authService.entrar(this.credencial).then((firebaseUser) => {
      this.storage.set(this.storageLoginEmail, this.credencial.email);

      if (!firebaseUser.emailVerified) {
        toast.setMessage("Você deve confirmar seu e-mail.");
        toast.setShowCloseButton(true);
        toast.present();

        this.authService.sair();
      } else {
        this.storage.set('uid', firebaseUser.uid);
        this.navCtrl.setRoot(HomePage);
      }
    }).catch((error: any) => {
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

    loading.dismiss();
  }
}
