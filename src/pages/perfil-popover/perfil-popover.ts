import { Component } from '@angular/core';
import { NavController, ViewController, ModalController, AlertController } from 'ionic-angular';

//Page
import { LoginPage } from "../login/login";

//Modal
import { PerfilAlterarEmailPage } from "../perfil-alterar-email/perfil-alterar-email";
import { PerfilAlterarSenhaPage } from "../perfil-alterar-senha/perfil-alterar-senha";

//Providers
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

@Component({
  selector: 'page-perfil-popover',
  templateUrl: 'perfil-popover.html',
})
export class PerfilPopoverPage {

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private authService: AuthServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPopoverPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  alterarEmail() {
    let perfilAlterarEmailPage = this.modalCtrl.create(PerfilAlterarEmailPage);

    perfilAlterarEmailPage.onDidDismiss(data => {
      console.log(data);
    });

    this.close();
    perfilAlterarEmailPage.present();
  }

  alterarSenha() {
    let perfilAlterarSenhaPage = this.modalCtrl.create(PerfilAlterarSenhaPage);

    perfilAlterarSenhaPage.onDidDismiss(data => {
      console.log(data)
    });

    this.close();
    perfilAlterarSenhaPage.present();
  }

  confirmarLogout() {
    let alert = this.alertCtrl.create({
      title: 'Sair',
      message: 'Você tem certeza que deseja sair?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sair',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    alert.present();
  }

  logout() {
    this.authService.sair().then(() => {
      this.navCtrl.setRoot(LoginPage);
    }).catch((error) => {
      console.error(error);
    });

    this.close();
  }
}
