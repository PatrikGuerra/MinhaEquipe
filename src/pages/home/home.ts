import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

//Pages
import { LoginPage } from "../login/login";
import { PerfilPage } from "../perfil/perfil";

//Providers
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

import { Storage } from '@ionic/storage';

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
    console.log("HomePage");

    this.storage.get("uid").then(uuid => {
      console.log(uuid)
    })
    console.log(this.storage.get("uid"))
  }

  verPerfil() {
    this.navCtrl.push(PerfilPage);
  }
}
