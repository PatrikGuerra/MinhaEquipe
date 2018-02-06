import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Pages - Modal
import { LocalSelectPage } from "../local-select/local-select";
import { UsuarioSelectPage } from "../usuario-select/usuario-select";

//Models
import { Tarefa } from "../../models/tarefa";
import { Equipe } from "../../models/equipe";
import { Local } from "../../models/local";

//Providers
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";
import { TarefaServiceProvider } from "../../providers/tarefa-service/tarefa-service";

import { TarefaSituacao } from "../../app/app.constants";

@Component({
  selector: 'page-tarefa',
  templateUrl: 'tarefa.html',
})
export class TarefaPage {
  private tarefaForm: FormGroup;

  private tarefa: Tarefa = new Tarefa();
  private equipe: Equipe;
  private enumTarefaSituacaoHtml = TarefaSituacao; //https://github.com/angular/angular/issues/2885
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public sessaoService: SessaoServiceProvider,
    public usuarioService: UsuarioServiceProvider,
    private tarefaService: TarefaServiceProvider) {

    this.tarefaForm = this.formBuilder.group({
      nome: ['', Validators.compose([Validators.required])],
      descricao: [''],
    });

    if (this.navParams.data.tarefa) {
      this.tarefa = this.navParams.data.tarefa;
    }

    if (this.navParams.data.equipe) {
      this.equipe = this.navParams.data.equipe;
    } else {
      this.equipe = this.sessaoService.equipe;
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad TarefaPage");
  }

  private salvar() {
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: "bottom"
    });

    let loading = this.loadingCtrl.create();

    if (this.tarefa.$key) {
      loading.setContent("Alterando Tarefa...");
      toast.setMessage("Tarefa alterada.");
    } else {
      loading.setContent("Criando Tarefa...");
      toast.setMessage("Tarefa criada.");
    }

    loading.present();

    this.tarefaService.salvar(this.tarefa, this.equipe.$key).then((data) => {
      loading.dismiss();
      toast.present();
      this.navCtrl.pop();
    }).catch((error) => {
      loading.dismiss();
      console.log(error);
    });
    console.log(this.tarefa)
    toast.dismiss();
  }

  private remover() {
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom',
      message: "Tarefa removida."
    });

    let loading = this.loadingCtrl.create({
      content: 'Removendo Tarefa...'
    });

    loading.present();

    this.tarefaService.remover(this.tarefa, this.equipe.$key).then((data) => {
      loading.dismiss();
      toast.present();
      this.navCtrl.pop();
    }).catch((error) => {
      loading.dismiss();
      console.error(error);
    });

    toast.dismiss();
  }

  public selecionarLocal() {
    let localSelectPage = this.modalCtrl.create(LocalSelectPage, {
      displayProperty: 'nome',
      title: "Local da tarefa",
      items: this.equipe.locais,
      keySelected: (this.tarefa.keyLocal) ? this.tarefa.keyLocal : ""
    });

    localSelectPage.onDidDismiss((data) => {
      if (data) {
        this.tarefa.local = data;
        this.tarefa.keyLocal = data.$key;
      }
    });

    localSelectPage.present();
  }

  public removerLocal() {
    this.tarefa.local = new Local();
    this.tarefa.keyLocal = "";
  }

  selecionarResponsaveis() {
    let usuarioSelectPage = this.modalCtrl.create(UsuarioSelectPage, {
      displayProperty: 'nome',
      title: "Responsáveis da tarefa",
      items: this.equipe.membros,
      selectedItens: this.tarefa.keyResponsaveis.slice()
    });

    usuarioSelectPage.onDidDismiss((data) => {
      if (data) {
        this.tarefa.keyResponsaveis = data.keys;
        this.tarefa.setReponsaveis(this.equipe.membros);
      }
    });

    usuarioSelectPage.present();
  }

  private mudarStatusTarefa(enumStatus: TarefaSituacao, textoLoading: string, textoToast: string) {
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom',
      message: textoToast
    });

    let loading = this.loadingCtrl.create({
      content: textoLoading
    });

    loading.present();

    this.tarefaService.alterarStatus(this.equipe.$key, this.tarefa, enumStatus).then((data) => {
      loading.dismiss();
      toast.present();
      this.navCtrl.pop();
    }).catch((error) => {
      console.error(error);
      loading.dismiss();
    });

    toast.dismiss();
  }
  public comecarTarefa() {
    this.mudarStatusTarefa(TarefaSituacao.Andamento, "Iniciando Tarefa...", "Tarefa iniciada.");
  }
  public finalizarTarefa() {
    this.mudarStatusTarefa(TarefaSituacao.Finalizado, "Finalizando Tarefa...", "Tarefa finalizada.");
  }
  public cancelarTarefa() {
    this.mudarStatusTarefa(TarefaSituacao.Cancelada, "Cancelando Tarefa...", "Tarefa cancelada.");
  }

  public isAdministradorEquipe() {
    let retorno = this.equipe.keyResponsavel == this.usuarioService.getUsuarioAplicacao().$key;
    return retorno;
  }
  
  public isResponsavel() {
    let retorno = this.tarefa.keyResponsaveis.indexOf(this.usuarioService.getUsuarioAplicacao().$key) > -1;
    return retorno;
  }

  public isSituacao(situacao: TarefaSituacao) {    
    let retorno = this.tarefa.situacao == situacao;
    return retorno;
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

    return "primary";
  }

  public descricaoBadge(tarefaSituacao: TarefaSituacao) {
    return TarefaSituacao[tarefaSituacao];
  }
}
