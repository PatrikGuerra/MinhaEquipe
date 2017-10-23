import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, ActionSheetController, LoadingController, AlertController, ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

//Modal
import { EquipeConvidarPage } from "../equipe-convidar/equipe-convidar";
import { ChatPage } from "../chat/chat";
import { LocaisPage } from "../locais/locais";

//Providers
import { EquipeServiceProvider } from "../../providers/equipe-service/equipe-service";
import { UserServiceProvider } from "../../providers/user-service/user-service";

//Models
import { Equipe } from "../../models/equipe";
import { Usuario } from "../../models/usuario";


@Component({
  selector: 'page-equipe',
  templateUrl: 'equipe.html',
})
export class EquipePage {
  key: string = "";
  equipe: Equipe = new Equipe();
  private imagemBase64: string = "";

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private actionsheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private navParams: NavParams,
    private equipeService: EquipeServiceProvider,
    private userService: UserServiceProvider) {

    if (this.navParams.data.equipe) {
      this.equipe = this.navParams.data.equipe;
      this.key = this.navParams.data.equipe.$key;

      console.log("---- EquipePage");
      console.log(this.equipe);
      console.log(this.key);
      console.log("---- EquipePage");
    }
  }

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
    }

    loading.present();

    this.equipeService.save(this.equipe, this.key, this.imagemBase64).then((data) => {
      loading.dismiss();
      this.navCtrl.pop();
      toast.present();
    }).catch((error) => {
      loading.dismiss();
      console.error(error);
    });

    toast.dismiss();
  }

  private menuAlterarImagem() {
    let actionSheet = this.actionsheetCtrl.create({
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.camera();
          }
        },
        {
          text: 'Galeria',
          icon: 'image',
          handler: () => {
            this.biblioteca();
          }
        }
      ]
    });

    actionSheet.present();
  }
  private camera() {
    let loading = this.loadingCtrl.create();
    loading.present();

    this.equipeService.pictureFromCamera().then((imageData) => {
      this.imagemBase64 = 'data:image/jpeg;base64,' + imageData;
    }).catch((error) => {
      this.imagemBase64 = "";
      console.error(error);
    });

    loading.dismiss();
  }
  private biblioteca() {
    let loading = this.loadingCtrl.create();
    loading.present();

    this.equipeService.pictureFromLibray().then((imageData) => {
      this.imagemBase64 = 'data:image/jpeg;base64,' + imageData;
    }).catch((error) => {
      this.imagemBase64 = "";
      console.error(error);
    });

    loading.dismiss();
  }

  private convidar() {
    console.log("abrir Convidar");
    this.navCtrl.push(EquipeConvidarPage, {
      equipe: this.equipe
    });
  }

  private abrirChat() {
    this.userService.getUser().then(userObservable => {
      userObservable.subscribe((usuarioData: Usuario) => {

        this.navCtrl.push(ChatPage, {
          equipe: this.equipe,
          usuario: usuarioData
        });

      });
    });
  }

  private abrirLocais() {
    console.log("Abrindo")
    //this.userService.getUser().then(userObservable => {
    //userObservable.subscribe((usuarioData: Usuario) => {

    this.navCtrl.push(LocaisPage, {
      equipe: this.equipe,
      //usuario: usuarioData
    });

    //});
    //});
  }

  /*
  private dataInicioMudou(value) {
    //(ionChange)="dataInicioMudou($event)"
    console.clear();

    console.log("-----------")
    console.log("this.equipe")
    console.log(this.equipe)
    console.log("-----------")
    console.log("value")
    console.log(value)
    console.log("-----------")
    var novaData = new Date(value.year, value.month, value.day, value.hour, value.minute, 0, 0)
    console.log("new Date(value)")
    console.log(novaData)
    console.log("-----------")
    console.log("novaData.toString()")
    console.log(novaData.toString())
    console.log("-----------")
    console.log("novaData.toISOString()")
    console.log(novaData.toISOString())

    if (!this.equipe.dataFim) {
      this.equipe.dataFim = novaData.toISOString();
    }
    //  if (!this.equipe.$key && ) {}
  }
  */
}
