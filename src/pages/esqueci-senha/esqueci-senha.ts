import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { NgForm } from '@angular/forms';

//Providers
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

//Models
import { User } from "../../providers/auth-service/user";
/**
 * Generated class for the EsqueciSenhaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-esqueci-senha',
  templateUrl: 'esqueci-senha.html',
})
export class EsqueciSenhaPage {
  emailUsuario: string = "";
  @ViewChild('form') form: NgForm;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private authService: AuthServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EsqueciSenhaPage');
  }

  esqueciSenha() {
    if (this.form.form.valid) {
      let toast = this.toastCtrl.create({ duration: 5000, position: 'bottom'});
     // let toast = this.toastCtrl.create({ position: 'bottom' });

      this.authService.esqueciSenha(this.emailUsuario)
      .then(() => {

        //toast.setShowCloseButton(true);
        toast.setMessage('A solicitação para alteração de senha foi enviada para seu e-mail.');
        toast.present();


        this.navCtrl.pop();
      })
      .catch((error: any) => {
        if (error.code == 'auth/invalid-email') {
          toast.setMessage('O e-mail digitado não é valido.');
        } else if (error.code == 'auth/user-not-found') {
          toast.setMessage('O usuário não foi encontrado.');
        }

        toast.present();
      });
    }
  }


}
