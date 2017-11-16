import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

//Pages
import { CadastroPage } from "../cadastro/cadastro";
import { EsqueciSenhaPage } from "../esqueci-senha/esqueci-senha";
import { EquipeListaPage } from "../equipe-lista/equipe-lista";

//Providers
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";

//Models
import { Credencial } from "../../models/credencial";

import { LocalStorage } from "../../app/app.constants";
import { EmailNaoConfirmadoException } from "../../customError/emailNaoConfirmadoException";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  private credencial: Credencial = new Credencial();

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private toastCtrl: ToastController,
    private storage: Storage,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private usuarioService: UsuarioServiceProvider) {

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      senha: ['', Validators.compose([Validators.required])]
    });

    this.storage.get(LocalStorage.LoginEmail).then((credencialEmail) => {
      if (credencialEmail) {
        this.credencial.email = credencialEmail;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  criarConta() {
    this.navCtrl.push(CadastroPage);
  }

  esqueciSenha() {
    this.navCtrl.push(EsqueciSenhaPage, {
      email: this.credencial.email
    });
  }

  entrar() {
    let loading = this.loadingCtrl.create({
      content: 'Autenticando...'
    });

    loading.present();

    this.usuarioService.entrar(this.credencial).then(data => {
      this.storage.set(LocalStorage.LoginEmail, this.credencial.email);

      this.navCtrl.setRoot(EquipeListaPage);
      loading.dismiss();
    }).catch((error: any) => {
      let toast = this.toastCtrl.create({
        position: 'bottom',
        dismissOnPageChange: true,
        duration: 5000
      });

      var errosAutenticacao = ['auth/user-disabled', 'auth/user-not-found', 'auth/wrong-password'];
      var errosAutenticacaoMsg = ['O usuário está desativado.', 'O usuário não foi encontrado.', 'A senha digitada não é valida.'];

      if (error instanceof EmailNaoConfirmadoException) {
        toast.setMessage(error.message);
      } else if (error.code == 'auth/invalid-email') {
        toast.setMessage('O e-mail digitado não é valido.');
      } else if (errosAutenticacao.indexOf(error.code) > -1) {
        console.error(errosAutenticacaoMsg[errosAutenticacao.indexOf(error.code)]);
        toast.setMessage('Usuário e/ou senha inválido(s)');
      }

      loading.dismiss();
      toast.present();
    });
  }
}

