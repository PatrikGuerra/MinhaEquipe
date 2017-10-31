import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,ToastController } from 'ionic-angular';

import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";
import { ConviteServiceProvider } from "../../providers/convite-service/convite-service";

import { ConviteUsuario } from "../../models/conviteUsuario";

//Pages
import { LocalPage } from "../local/local";

//Models
import { Local } from "../../models/local";
import { Equipe } from "../../models/equipe";

//Service
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";
import { LocalServiceProvider } from "../../providers/local-service/local-service";

@Component({
  selector: 'page-locais',
  templateUrl: 'locais.html',
})
export class LocaisPage {
  private equipe: Equipe;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    //private loadingCtrl: LoadingController,
    public sessaoService: SessaoServiceProvider,
    private localService: LocalServiceProvider) {

    this.equipe = this.sessaoService.equipe;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocaisPage');
  }

  novoLocal() {
    this.navCtrl.push(LocalPage);
  }

  editarLocal(local: Local) {
    this.navCtrl.push(LocalPage, {
      local: local,
    });
  }

  removerLocal(local: Local) {
    this.localService.remove(local.$key);
  }
}
