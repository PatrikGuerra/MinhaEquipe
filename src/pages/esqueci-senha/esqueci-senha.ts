import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Providers
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

@Component({
  selector: 'page-esqueci-senha',
  templateUrl: 'esqueci-senha.html',
})
export class EsqueciSenhaPage {
  esqueciSenhaForm: FormGroup;
  private email: string = "";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    private authService: AuthServiceProvider, ) {

    if (this.navParams.data.email) {
      this.email = this.navParams.data.email;
    }

    this.esqueciSenhaForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EsqueciSenhaPage');
  }

  private esqueciSenha() {
    let toast = this.toastCtrl.create({
      duration: 5000,
      position: 'bottom'
    });

    var emailUsuario = this.esqueciSenhaForm.value.email;

    this.authService.esqueciSenha(emailUsuario).then((data) => {
      toast.setMessage('A solicitação para alteração de senha foi enviada para seu e-mail.');
      toast.present();

      this.navCtrl.pop();
    }).catch((error: any) => {
      if (error.code == 'auth/invalid-email') {
        toast.setMessage('O e-mail digitado não é valido.');
      } else if (error.code == 'auth/user-not-found') {
        toast.setMessage('O usuário não foi encontrado.');
      }

      toast.present();
    });
  }

}
