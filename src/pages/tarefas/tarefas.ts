import { Component } from '@angular/core';
import { App, NavController, NavParams, LoadingController, PopoverController } from 'ionic-angular';

//Pages
import { TarefaPage } from "../tarefa/tarefa";

// Popover
import { ContextoPopoverPage } from "../contexto-popover/contexto-popover";

//Services
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";

//Models
import { Equipe } from "../../models/equipe";
import { Tarefa } from "../../models/tarefa";

@Component({
  selector: 'page-tarefas',
  templateUrl: 'tarefas.html',
})
export class TarefasPage {
  private equipe: Equipe = new Equipe();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private sessaoService: SessaoServiceProvider,
    private usuarioService: UsuarioServiceProvider,

    private app: App,
    public popoverCtrl: PopoverController) {

    this.equipe = this.sessaoService.equipe;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TarefasPage');
  }

  public abrirPopover(myEvent) {
    let contextoPopoverPage = this.popoverCtrl.create(ContextoPopoverPage);

    contextoPopoverPage.present({
      ev: myEvent
    });
  }

  novaTarefa() {
    this.app.getRootNav().push(TarefaPage)
    // this.navCtrl.push(TarefaPage);
  }

  editarTarefa(tarefa: Tarefa) {
    this.app.getRootNav().push(TarefaPage, {
      tarefa: tarefa
    });
    
    // this.navCtrl.push(TarefaPage, {
    //   tarefa: tarefa
    // });
  }

  isAdministradorEquipe() {
    let retorno = this.equipe.keyResponsavel == this.usuarioService.usuario.$key;
    return retorno;
  }

}
