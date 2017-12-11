import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams, LoadingController, PopoverController } from 'ionic-angular';

//Pages
import { TarefaPage } from "../tarefa/tarefa";

//Services
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";
import { EquipeServiceProvider } from "../../providers/equipe-service/equipe-service";
import { TarefaServiceProvider } from "../../providers/tarefa-service/tarefa-service";
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";

//Enum
import { TarefaSituacao } from "../../app/app.constants";

//Models
import { Equipe } from "../../models/equipe";
import { Tarefa } from "../../models/tarefa";
import { UsuarioTarefasEquipe } from "../../models/usuarioTarefasEquipe";

@IonicPage()
@Component({
  selector: 'page-tarefas-usuario',
  templateUrl: 'tarefas-usuario.html',
})
export class TarefasUsuarioPage {
  private listaUsuarioTarefasEquipe: UsuarioTarefasEquipe[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController,

    private usuarioService: UsuarioServiceProvider,
    private equipeService: EquipeServiceProvider,
    private tarefaService: TarefaServiceProvider,
    private sessaoService: SessaoServiceProvider) {
  }

  ionViewDidEnter() {
    this.carregar();
  }

  private carregar() {
    let loading = this.loadingCtrl.create({
      content: 'Carregando tarefas...'
    });

    loading.present();

    this.tarefaService.getUsuarioTarefasEquipe(this.usuarioService.usuario.$key).subscribe((data: UsuarioTarefasEquipe[]) => {
      data.forEach(usuarioTarefasEquipe => {
        this.equipeService.getEquipe(usuarioTarefasEquipe.keyEquipe).subscribe((dataEquipe: Equipe) => {
          usuarioTarefasEquipe.equipe = dataEquipe;
        });
      });

      this.listaUsuarioTarefasEquipe = data;
      console.clear()

      console.log(data);
      loading.dismiss();
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TarefasPage');
  }

  public abrirTarefa(keyEquipe: string, tarefa: Tarefa) {
    let loading = this.loadingCtrl.create({
      content: 'Carregando tarefa...'
    });

    loading.present();

    this.sessaoService.getEquipeCompleta(keyEquipe).then((dataEquipe: Equipe) => {
      for (let index = 0; index < dataEquipe.tarefas.length; index++) {
        if (dataEquipe.tarefas[index].$key == tarefa.$key) {
          tarefa = dataEquipe.tarefas[index];
          break;
        }
      }

      loading.dismiss();

      this.navCtrl.push(TarefaPage, {
        tarefa: tarefa.Copy(),
        equipe: dataEquipe
      });
    });
  }

  public corBadge(tarefaSituacao: TarefaSituacao) {
    if (tarefaSituacao == TarefaSituacao.Andamento) {
      return "cortarefaandamento";
    } else if (tarefaSituacao == TarefaSituacao.Cancelada) {
      return "cortarefacancelada";
    } else if (tarefaSituacao == TarefaSituacao.Finalizado) {
      return "cortarefafinalizado";
    } else if (tarefaSituacao == TarefaSituacao.Pendente) {
      return "cortarefapendente";
    }
    alert("erro");
    return '';
  }

  public descricaoBadge(tarefaSituacao: TarefaSituacao) {
    return TarefaSituacao[tarefaSituacao];
  }
}
