import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams, LoadingController, PopoverController } from 'ionic-angular';

//Pages
import { TarefaPage } from "../tarefa/tarefa";

//Services
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";

//Models
import { Equipe } from "../../models/equipe";
import { Tarefa } from "../../models/tarefa";

import { TarefaServiceProvider } from "../../providers/tarefa-service/tarefa-service";

@IonicPage()
@Component({
  selector: 'page-tarefas-usuario',
  templateUrl: 'tarefas-usuario.html',
})
export class TarefasUsuarioPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private sessaoService: SessaoServiceProvider,
    private usuarioService: UsuarioServiceProvider,

    public popoverCtrl: PopoverController,
    public tarefaService: TarefaServiceProvider) {


    let loading = this.loadingCtrl.create({
      content: 'Carregando tarefas...'
    });

    loading.present();

    this.tarefaService.getKeyTarefasUsuario(this.usuarioService.usuario.$key).subscribe(tarefasArray => {
      console.log(tarefasArray)
      console.log(Object.keys(tarefasArray))
      loading.dismiss();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TarefasPage');
  }

  editarTarefa(tarefa: Tarefa) {
    // this.navCtrl.push(TarefaPage, {
    //   tarefa: tarefa.Copy()
    // });
  }
}
