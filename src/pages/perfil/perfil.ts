import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

//import { NgForm } from '@angular/forms';

//import { Camera, CameraOptions } from '@ionic-native/camera';

//Providers
import { UserServiceProvider } from "../../providers/user-service/user-service";

//Models





//@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
   usuario = {};

  constructor(
    public navCtrl: NavController,
    //public navParams: NavParams,
    // public authService: AuthServiceProvider,
    //  public camera: Camera
    public userProvider: UserServiceProvider) {

      this.userProvider.getUser().then(userObservable => {
          userObservable.subscribe(usuarioData => {
            console.log(usuarioData)
              this.usuario = usuarioData;
          });
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
  }

  logout() {

  }

  updatePicture() {

  }
  alterar() {
    console.log(this.usuario)
  }
}
