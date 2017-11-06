import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//Pages
import { LocalPage } from "../local/local";

//Models
import { Local } from "../../models/local";
import { Equipe } from "../../models/equipe";

//Service
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";
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
    public sessaoService: SessaoServiceProvider,
    private usuarioProvider: UsuarioServiceProvider,
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

  isAdministradorEquipe() {
    let retorno = this.equipe.keyResponsavel == this.usuarioProvider.usuario.$key;
    return retorno;
  }
}
