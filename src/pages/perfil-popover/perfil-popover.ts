import { Component } from '@angular/core';
import { NavController, ViewController, ModalController, AlertController } from 'ionic-angular';
import { IonicPage, App, NavParams, Nav } from 'ionic-angular';

//Pages
import { EquipeListaPage } from "../equipe-lista/equipe-lista";
import { ConvitesPage } from "../convites/convites";
import { PerfilAlterarEmailPage } from "../perfil-alterar-email/perfil-alterar-email";
import { PerfilAlterarSenhaPage } from "../perfil-alterar-senha/perfil-alterar-senha";
import { LoginPage } from "../login/login";

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
    private authService: AuthServiceProvider,
    
    private app: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPopoverPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  abrirListaEquipes() {
    this.close();
    this.app.getRootNav().setRoot(EquipeListaPage);
  }

  abrirConvites() {
    // this.viewCtrl.dismiss().then(a => {
    this.app.getRootNav().push(ConvitesPage);
    this.viewCtrl.dismiss()
    // })
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
