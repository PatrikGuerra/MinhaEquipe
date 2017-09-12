import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { NgForm } from '@angular/forms';

//PAges
import { LoginPage } from "../login/login";

//Providers
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

//Models
import { User } from "../../providers/auth-service/user";
/**
 * Generated class for the CadastroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})
export class CadastroPage {
  user: User = new User();
  @ViewChild('form') form: NgForm;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private authService: AuthServiceProvider ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastroPage');
  }

  criarConta() {
    if (this.form.form.valid) {
      let toast = this.toastCtrl.create({ position: 'bottom' });

      this.authService.criarUsuario(this.user)
        .then((usuarioRetorno: any) => {
          usuarioRetorno.sendEmailVerification();
          
          toast.setShowCloseButton(true);
          toast.setMessage('Usuário criado com sucesso. Verifique seu e-mail.');
          toast.present();

          this.authService.sair();
          
          this.navCtrl.setRoot(LoginPage);
        })
        .catch((error: any) => {
          //let toast = this.toastCtrl.create({ duration: 3000, position: 'bottom' });
          toast.setDuration(3000);

          if (error.code  == 'auth/email-already-in-use') {
            toast.setMessage('O e-mail digitado já está em uso.');
          } else if (error.code  == 'auth/invalid-email') {
            toast.setMessage('O e-mail digitado não é valido.');
          } else if (error.code  == 'auth/operation-not-allowed') {
            toast.setMessage('Não está habilitado criar usuários.');
          } else if (error.code  == 'auth/weak-password') {
            toast.setMessage('A senha digitada é muito fraca.');
          }

          toast.present();
        });
    }
  }

}
