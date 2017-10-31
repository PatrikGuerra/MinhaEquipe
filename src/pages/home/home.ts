import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

//Pages
import { LoginPage } from "../login/login";
import { PerfilPage } from "../perfil/perfil";
import { EquipeListaPage } from "../equipe-lista/equipe-lista";
import { ConvitesPage } from "../convites/convites";

//Providers
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

import { dataBaseStorage } from "../../app/app.constants";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    private authService: AuthServiceProvider,
    public storage: Storage) {
  }

  ionViewDidLoad() {
    this.storage.get("uid").then(uuid => {
      console.log(uuid)
    })
    
    console.log("dataBaseStorage[0]")
    console.log(dataBaseStorage[0])
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
