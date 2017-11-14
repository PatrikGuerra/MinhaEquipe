import { Component } from '@angular/core';
import { NavController, ViewController, ModalController, AlertController } from 'ionic-angular';
import { IonicPage, App, NavParams, Nav } from 'ionic-angular';

//Pages
import { EquipeListaPage } from "../equipe-lista/equipe-lista";
import { ConvitesPage } from "../convites/convites";
import { PerfilPage } from "../perfil/perfil";

@Component({
  selector: 'page-contexto-popover',
  templateUrl: 'contexto-popover.html',
})
export class ContextoPopoverPage {

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,

    private app: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContextoPopoverPage');
  }

  abrirListaEquipes() {
    // this.viewCtrl.dismiss().then(a => {
      this.app.getRootNav().setRoot(EquipeListaPage);
       this.viewCtrl.dismiss()
    // })
  }

  abrirConvites() {
    // this.viewCtrl.dismiss().then(a => {
      this.app.getRootNav().push(ConvitesPage);
       this.viewCtrl.dismiss()
    // })
  }

  abrirPerfil() {
    // this.viewCtrl.dismiss().then(a => {
      this.app.getRootNav().setRoot(PerfilPage);
       this.viewCtrl.dismiss()
    // })
  }
}
