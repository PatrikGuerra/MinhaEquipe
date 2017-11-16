import { Component } from '@angular/core';
import { App, NavController, NavParams, PopoverController } from 'ionic-angular';

//Pages
import { LocalPage } from "../local/local";

//Models
import { Local } from "../../models/local";
import { Equipe } from "../../models/equipe";

//Service
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";
import { LocalServiceProvider } from "../../providers/local-service/local-service";

// Popover
import { ContextoPopoverPage } from "../contexto-popover/contexto-popover";

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
    private usuarioService: UsuarioServiceProvider,
    private localService: LocalServiceProvider,
    
    private app: App,
    public popoverCtrl: PopoverController) {

    this.equipe = this.sessaoService.equipe;
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocaisPage');
  }

  public abrirPopover(myEvent) {
    let contextoPopoverPage = this.popoverCtrl.create(ContextoPopoverPage);

    contextoPopoverPage.present({
      ev: myEvent
    });
  }

  novoLocal() {
    this.app.getRootNav().push(LocalPage);
    // this.navCtrl.push(LocalPage);
  }

  editarLocal(local: Local) {
    this.app.getRootNav().push(LocalPage, {
      local: local,
    });
    // this.navCtrl.push(LocalPage, {
    //   local: local,
    // });
  }

  removerLocal(local: Local) {
    this.localService.remove(local.$key);
  }

  isAdministradorEquipe() {
    let retorno = this.equipe.keyResponsavel == this.usuarioService.usuario.$key;
    return retorno;
  }
}
