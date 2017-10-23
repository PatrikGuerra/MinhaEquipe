import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Pages - Modal
import { LocalMapaPage } from "../local-mapa/local-mapa";

//Models
import { Local } from "../../models/local";
import { Equipe } from "../../models/equipe";
import { Coordenadas } from "../../models/coordenadas";

import { LocalServiceProvider } from "../../providers/local-service/local-service";

@Component({
  selector: 'page-local',
  templateUrl: 'local.html',
})
export class LocalPage {
  localForm: FormGroup;
  local: Local = new Local();
  equipe: Equipe;
  key: string = ""

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private localService: LocalServiceProvider) {

    this.localForm = this.formBuilder.group({
      nome: ['', Validators.compose([Validators.required])],
      descricao: ['', Validators.compose([Validators.required])],
    });

    console.log("this.navParams.data")
    console.log(this.navParams.data)

    if (this.navParams.data.equipe) {
      this.equipe = this.navParams.data.equipe;
    }

    if (this.navParams.data.key) {
      this.local = this.navParams.data.local;
      this.key = this.navParams.data.key;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocalPage');
  }


  save() {
    let isUpdate = (this.key.length > 0);

    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom'
    });

    let loading = this.loadingCtrl.create();

    if (isUpdate) {
      toast.setMessage("Local alterado.");
      loading.setContent('Alterando Local...');
    } else {
      toast.setMessage("Local criado.");
      loading.setContent('Criando Local...');
    }

    loading.present();

    this.localService.save(this.local, this.key, this.equipe.$key).then((data) => {
      loading.dismiss();
      toast.present();
      this.navCtrl.pop();
    }).catch((error) => {
      loading.dismiss();
      console.error(error);
    });

    toast.dismiss();
  }

  selecionarLocal() {

    let localMapaPage = this.modalCtrl.create(LocalMapaPage, {
      coordenadas: (this.local && this.local.coordenadas) ? this.local.coordenadas : null
    });


    localMapaPage.onDidDismiss((data) => {
      console.log(data)

      if (data) {
        this.local.coordenadas = <Coordenadas>data.coordenada
      }
    });

    localMapaPage.present();
  }
}
