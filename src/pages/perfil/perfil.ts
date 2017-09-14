import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { NgForm } from '@angular/forms';

//Providers
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

//Models
import { User } from "../../providers/auth-service/user";
/*
//Pages
import { LoginPage } from "../login/login";

//Providers
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

//Models
import { User } from "../../providers/auth-service/user";
*/
/**
 * Generated class for the PerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  user: User = new User();

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private authService: AuthServiceProvider) {

      
      
      //var obj = 
     // this.user.email = (User)authService.pegaUsuario();
      //this.user
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
  }

}
