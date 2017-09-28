import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, ActionSheetController, LoadingController, AlertController, ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

//Page
//import { LoginPage } from "../login/login";

//Modal
//import { PerfilAlterarEmailPage } from "../perfil-alterar-email/perfil-alterar-email";

//Providers
import { EquipeServiceProvider } from "../../providers/equipe-service/equipe-service";
//import { UserServiceProvider } from "../../providers/user-service/user-service";
//import { AuthServiceProvider } from "../../providers/auth-service/auth-service";


//Components
//import { TagsInputComponent } from "../../components/tags-input/tags-input.component";

@Component({
  selector: 'page-equipe',
  templateUrl: 'equipe.html',
})
export class EquipePage {
  equipe: any = {};

  equipeUid: string = ""; //isso aqui nao vai ficar assim, temporario

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private actionsheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController,
    // private userProvider: UserServiceProvider,
    //private authService: AuthServiceProvider
    private equipeService: EquipeServiceProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipePage');
  }








  alterarEquipe() {
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom',
      message: "Perfil alterado."
    });

    let loading = this.loadingCtrl.create({
      content: 'Alterando informações da equipe...'
    });

    loading.present();
/*
    this.equipeService.save(this.equipe).then((data) => {
      loading.dismiss();
      toast.present();
    });
*/
    toast.dismiss();
    loading._destroy;
  }

}
