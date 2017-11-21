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
  private enumTarefaSituacao = TarefaSituacao; //https://github.com/angular/angular/issues/2885

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
      descricao: ['', Validators.compose([Validators.required])],
    });

    if (this.navParams.data.tarefa) {
      this.tarefa = this.navParams.data.tarefa;
    }

    this.equipe = this.sessaoService.equipe;
    this.tarefa.keyEquipe = this.equipe.$key;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TarefaPage');
  }

  private save() {
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom'
    });

    let loading = this.loadingCtrl.create();

    if (this.tarefa.$key) {
      loading.setContent('Alterando Tarefa...');
      toast.setMessage("Tarefa alterada.");
    } else {
      loading.setContent('Criando Tarefa...');
      toast.setMessage("Tarefa criada.");
    }

    loading.present();

    this.tarefaService.save(this.tarefa).then((data) => {
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

    this.tarefaService.remover(this.tarefa).then((data) => {
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
      items: this.sessaoService.equipe.locais,
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
      items: this.sessaoService.equipe.membros,
      selectedItens: this.tarefa.keyResponsaveis.slice()
    });

    usuarioSelectPage.onDidDismiss((data) => {
      if (data) {
        this.tarefa.keyResponsaveis = data.keys;
        this.tarefa.setReponsaveis(this.sessaoService.equipe.membros);
      }
    });

    usuarioSelectPage.present();
  }

  comecarTarefa() {
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom',
      message: "Tarefa iniciada."
    });

    let loading = this.loadingCtrl.create( {
      content: 'Iniciando Tarefa...'
    });

    loading.present();

    this.tarefaService.alterarStatus(this.tarefa, this.enumTarefaSituacao.Andamento).then((data) => {
      loading.dismiss();
      toast.present();
      this.navCtrl.pop();
    }).catch((error) => {
      loading.dismiss();
    });

    toast.dismiss();
  }
  finalizarTarefa() {
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom',
      message: "Tarefa finalizada."
    });

    let loading = this.loadingCtrl.create( {
      content: 'Finalizando Tarefa...'
    });

    loading.present();

    this.tarefaService.alterarStatus(this.tarefa, this.enumTarefaSituacao.Finalizado).then((data) => {
      loading.dismiss();
      toast.present();
      this.navCtrl.pop();
    }).catch((error) => {
      loading.dismiss();
    });

    toast.dismiss();
  }
  cancelarTarefa() {
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom',
      message: "Tarefa finalizada."
    });

    let loading = this.loadingCtrl.create( {
      content: 'Finalizando Tarefa...'
    });

    loading.present();

    this.tarefaService.alterarStatus(this.tarefa, this.enumTarefaSituacao.Cancelada).then((data) => {
      loading.dismiss();
      toast.present();
      this.navCtrl.pop();
    }).catch((error) => {
      loading.dismiss();
    });

    toast.dismiss();
  }

  private isAdministradorEquipe() {
    let retorno = this.equipe.keyResponsavel == this.usuarioService.usuario.$key;
    return retorno;
  }
  
  private isResponsavel() {
    let retorno = this.tarefa.keyResponsaveis.indexOf(this.usuarioService.usuario.$key) > -1;
    return retorno;
  }

  private isSituacao(situacao: TarefaSituacao) {    
    let retorno = this.tarefa.situacao == situacao;
    return retorno;
  }
  
  private corBadge(tarefaSituacao: TarefaSituacao) {
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

  private descricaoBadge(tarefaSituacao: TarefaSituacao) {
    return TarefaSituacao[tarefaSituacao];
  }
}
