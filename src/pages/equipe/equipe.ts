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


//Components
//import { TagsInputComponent } from "../../components/tags-input/tags-input.component";


//Models
import { Equipe } from "../../models/equipe";


@Component({
  selector: 'page-equipe',
  templateUrl: 'equipe.html',
})
export class EquipePage {
  key: string = "";
  equipe: Equipe = new Equipe();
  imagemBase64: string = "";

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private actionsheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private navParams: NavParams,
    private equipeService: EquipeServiceProvider) {

    if (this.navParams.data.equipe) {
      this.equipe = this.navParams.data.equipe;
      this.key = this.navParams.data.equipe.$key;
    }
  }
  //voltar ate aqui
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipePage');
  }

  private save() {
    let isUpdate = (this.key.length > 0);

    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom'
    });

    let loading = this.loadingCtrl.create();

    if (isUpdate) {
      toast.setMessage("Equipe alterada.");
      loading.setContent('Alterando equipe...');
    } else {
      toast.setMessage("Equipe criada.");
      loading.setContent('Criando equipe...');

      this.equipe.dataCriacao = Date.now();
    }

    loading.present();

    this.equipeService.save(this.equipe, this.key, this.imagemBase64).then((data) => {
      loading.dismiss();
      this.navCtrl.pop();
      toast.present();
    });

    toast.dismiss();
    loading._destroy;
  }

  //daqui pra baixo ta SHOW

  menuAlterarImagem() {
    let actionSheet = this.actionsheetCtrl.create({
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.camera()
          }
        },
        {
          text: 'Galeria',
          icon: 'image',
          handler: () => {
            this.biblioteca()
          }
        }
      ]
    });

    actionSheet.present();
  }
  camera() {
    let loading = this.loadingCtrl.create({
      //content: 'Alterando imagem da equipe...'
    });

    loading.present();

    this.equipeService.pictureFromCamera().then((imageData) => {
      this.imagemBase64 = 'data:image/jpeg;base64,' + imageData;

    }, (erro) => {
      this.imagemBase64 = "";
      console.log(erro);
    });
    loading.dismiss();
  }
  biblioteca() {
    let loading = this.loadingCtrl.create({
      //content: 'Alterando imagem da equipe...'
    });

    loading.present();

    this.equipeService.pictureFromLibray().then((imageData) => {
      this.imagemBase64 = 'data:image/jpeg;base64,' + imageData;

    }, (erro) => {
      this.imagemBase64 = "";
      console.log(erro);
    });

    loading.dismiss();
  }
}
