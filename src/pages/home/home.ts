import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

//Pages
import { LoginPage } from "../login/login";

//Providers
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

//Models
import { User } from "../../providers/auth-service/user";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private authService: AuthServiceProvider) {
  }

  ionViewDidLoad() {
    console.log("HomePage");
  }

  sair() {
    this.authService.sair().then(() => {
      this.navCtrl.setRoot(LoginPage);
    })
    .catch((error) => {
      console.error(error);
    })
  }

  verPerfil() {
    //this.navCtrl.setRoot(Perfil);
  }

}
