import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Pages
import { LoginPage } from "../login/login";

//Providers
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { UserServiceProvider } from "../../providers/user-service/user-service";

//Models
import { Credencial } from "../../models/credencial";

@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})
export class CadastroPage {
  cadastroForm: FormGroup;
  credencial: Credencial = new Credencial();

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private authService: AuthServiceProvider,
    private userService: UserServiceProvider) {

    this.cadastroForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      senha: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastroPage');
  }

  criarConta() {
    let toast = this.toastCtrl.create({
      position: 'bottom'
    });

    let loading = this.loadingCtrl.create({
      content: 'Criando usuário...'
    })

    loading.present();

    console.log(this.credencial)
    this.authService.criarUsuario(this.credencial).then((firebaseUser: any) => {
      firebaseUser.sendEmailVerification();
      console.log(firebaseUser);

      this.userService.criarUsuario(this.credencial.email, firebaseUser.uid).then((data) => {
        toast.setShowCloseButton(true);
        toast.setMessage('Usuário criado com sucesso. Verifique seu e-mail.');
        toast.present();

        this.authService.sair().then((dataSair) => {
          this.navCtrl.setRoot(LoginPage);
        });
      });

    }).catch((error: any) => {
      toast.setDuration(3000);
      console.log("Erro:");
      console.log(error);

      if (error.code == 'auth/email-already-in-use') {
        toast.setMessage('O e-mail digitado já está em uso.');
      } else if (error.code == 'auth/invalid-email') {
        toast.setMessage('O e-mail digitado não é valido.');
      } else if (error.code == 'auth/operation-not-allowed') {
        toast.setMessage('Não está habilitado criar usuários.');
      } else if (error.code == 'auth/weak-password') {
        toast.setMessage('A senha digitada é muito fraca.');
      }

      toast.present();
    });

    loading.dismiss();
  }

}
