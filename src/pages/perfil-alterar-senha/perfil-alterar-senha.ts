import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';

//Providers
import { UserServiceProvider } from "../../providers/user-service/user-service";

@Component({
  selector: 'page-perfil-alterar-senha',
  templateUrl: 'perfil-alterar-senha.html',
})
export class PerfilAlterarSenhaPage {
  alterarSenhaForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private userProvider: UserServiceProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {

    this.alterarSenhaForm = formBuilder.group({
      senhaAtual: ['', Validators.compose([Validators.required])],
      novaSenha: ['', Validators.compose([Validators.required])],
      novaSenhaConfirmar: ['', Validators.compose([Validators.required])]
    }, { validator: this.saoIguais('novaSenha', 'novaSenhaConfirmar') }
    );
  }

  private saoIguais(campoPrincipal: string, campoConfirmacao: string) {
    return (group: FormGroup): { [key: string]: any } => {

      let principal = group.controls[campoPrincipal];
      let confirmacao = group.controls[campoConfirmacao];

      if (principal.value !== confirmacao.value) {
        return {
          diferente: true
        };
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilAlterarSenhaPage');
  }

  cancelar() {
    this.viewCtrl.dismiss();
  }

  alterarSenha() {
    let loading = this.loadingCtrl.create({
      content: 'Alterando senha...'
    });

    let alert = this.alertCtrl.create({
      buttons: ['Ok']
    });

    loading.present();

    var senhaAtual = this.alterarSenhaForm.value.senhaAtual;
    var novaSenha = this.alterarSenhaForm.value.novaSenha;

    this.userProvider.atualizarSenha(novaSenha, senhaAtual).then((data) => {
      loading.dismiss();

      alert.onDidDismiss((data) => {
        this.viewCtrl.dismiss();
      });

      alert.setMessage("Senha alterada com sucesso.");
      alert.present();
    }).catch((error: any) => {
      console.log(error);

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

      //authService.updatePassword
      if (error.code == 'auth/weak-password') {
        console.log("Thrown if the password is not strong enough.")
        alert.setMessage('A senha digitada é muito fraca.');
      } else if (error.code == 'auth/requires-recent-login') {
        console.log("Thrown if the user's last sign-in time does not meet the security threshold. Use firebase.User#reauthenticateWithCredential to resolve. This does not apply if the user is anonymous.")
      }

      loading.dismiss();
      alert.present();
    });
  }
}
