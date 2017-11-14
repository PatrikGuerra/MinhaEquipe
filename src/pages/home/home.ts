import { Component } from '@angular/core';
import { IonicPage, App, NavParams, Nav, NavController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

//Pages
import { PerfilPage } from "../perfil/perfil";
import { EquipeListaPage } from "../equipe-lista/equipe-lista";
import { ConvitesPage } from "../convites/convites";
import { LocalMapaPage } from "../../pages/local-mapa/local-mapa";

import { dataBaseStorage } from "../../app/app.constants";

import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public usuarioService: UsuarioServiceProvider,
    private app: App) {
  }

  ionViewDidLoad() {
    this.storage.get("uid").then(uuid => {
      console.log(uuid)
    })

    console.log(this.usuarioService.usuario);
  }

  verPerfil() {
    this.app.getRootNav().setRoot(PerfilPage);
  }

  verEquipes() {
    this.navCtrl.push(EquipeListaPage);
  }

  verConvites() {
    this.app.getRootNav().push(ConvitesPage)

   // this.navCtrl.push(ConvitesPage);
  }
}
