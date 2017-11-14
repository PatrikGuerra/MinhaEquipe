import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Pages - Modal
import { LocalMapaPage } from "../local-mapa/local-mapa";

//Models
import { Local } from "../../models/local";
import { Equipe } from "../../models/equipe";
import { Coordenadas } from "../../models/coordenadas";

//Providers
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";
import { LocalServiceProvider } from "../../providers/local-service/local-service";

@Component({
  selector: 'page-local',
  templateUrl: 'local.html',
})
export class LocalPage {
  private localForm: FormGroup;
  private local: Local = new Local();
  private equipe: Equipe;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public sessaoService: SessaoServiceProvider,
    private localService: LocalServiceProvider) {

    this.localForm = this.formBuilder.group({
      nome: ['', Validators.compose([Validators.required])],
      descricao: ['', Validators.compose([Validators.required])],
    });

    this.equipe = this.sessaoService.equipe;

    if (this.navParams.data.local) {
      this.local = this.navParams.data.local;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocalPage');
  }

  save() {
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom'
    });

    let loading = this.loadingCtrl.create();

    if (this.local.$key) {
      loading.setContent('Alterando Local...');
      toast.setMessage("Local alterado.");
    } else {
      loading.setContent('Criando Local...');
      toast.setMessage("Local criado.");
    }

    loading.present();

    this.localService.save(this.local, this.equipe.$key).then((data) => {
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
      if (data) {
        this.local.coordenadas = <Coordenadas>data.coordenada
      }
    });

    localMapaPage.present();
  }
}
