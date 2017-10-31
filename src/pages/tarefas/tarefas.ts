import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

//Pages
import { TarefaPage } from "../tarefa/tarefa";

//Services
import { TarefaServiceProvider } from "../../providers/tarefa-service/tarefa-service";
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";

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
    private tarefaService: TarefaServiceProvider,
    private usuarioService: UsuarioServiceProvider) {

    this.equipe = this.sessaoService.equipe;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TarefasPage');
  }

  novaTarefa() {
    this.navCtrl.push(TarefaPage);
  }

  editarTarefa(tarefa: Tarefa) {
    this.navCtrl.push(TarefaPage, {
      tarefa: tarefa
    });
  }
}
