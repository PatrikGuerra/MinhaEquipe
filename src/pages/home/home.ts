import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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
    public usuarioProvider: UsuarioServiceProvider) {
  }

  ionViewDidLoad() {
    this.storage.get("uid").then(uuid => {
      console.log(uuid)
    })
    console.log(this.usuarioProvider.usuario);
  }

  verPerfil() {
    this.navCtrl.push(PerfilPage);
  }

  verEquipes() {
    this.navCtrl.push(EquipeListaPage);
  }

  verConvites() {
    this.navCtrl.push(ConvitesPage);
  }
}
