import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,ToastController } from 'ionic-angular';

import { UserServiceProvider } from "../../providers/user-service/user-service";
import { ConviteServiceProvider } from "../../providers/convite-service/convite-service";

import { ConviteUsuario } from "../../models/conviteUsuario";

//Pages
import { LocalPage } from "../local/local";

//Models
import { Local } from "../../models/local";
import { Equipe } from "../../models/equipe";

//Service
import { LocalServiceProvider } from "../../providers/local-service/local-service";

@Component({
  selector: 'page-locais',
  templateUrl: 'locais.html',
})
export class LocaisPage {
  private equipe: Equipe;
  private locais: Local[] = [];
  private usuarioUid: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private localService: LocalServiceProvider) {

    let loading = this.loadingCtrl.create({
      content: 'Carregando locais...'
    });

    loading.present();

    this.equipe = this.navParams.data.equipe;

    this.localService.getLocais(this.equipe.$key).subscribe((data: Local[]) => {
      this.locais = data;
      loading.dismiss();
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocaisPage');
  }

  novoLocal() {
    this.navCtrl.push(LocalPage, {
     // local: local,
      equipe: this.equipe,
     // key: local.$key
    });
  }

  editarLocal(local: Local) {
    this.navCtrl.push(LocalPage, {
      local: local,
      equipe: this.equipe,
      key: local.$key
    });
  }

  removerLocal(local: Local) {
    this.localService.remove(local.$key);
  }
}
