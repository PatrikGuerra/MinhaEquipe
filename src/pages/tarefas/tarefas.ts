import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

//Pages
import { TarefaPage } from "../tarefa/tarefa";

//Services
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
    private sessaoService: SessaoServiceProvider) {

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
