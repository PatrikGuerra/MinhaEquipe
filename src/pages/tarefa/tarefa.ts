import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Pages - Modal
import { LocalSelectPage } from "../local-select/local-select";
import { UsuarioSelectPage } from "../usuario-select/usuario-select";

//Models
import { Tarefa } from "../../models/tarefa";
import { Equipe } from "../../models/equipe";

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
    public usuarioProvider: UsuarioServiceProvider,
    private tarefaService: TarefaServiceProvider) {

    this.tarefaForm = this.formBuilder.group({
      nome: ['', Validators.compose([Validators.required])],
      descricao: ['', Validators.compose([Validators.required])],
    });

    if (this.navParams.data.tarefa) {
      console.log("this.navParams.data")
      console.log(this.navParams.data)
      this.tarefa = this.navParams.data.tarefa;
    }

    console.log("this.usuarioProvider.usuario");
    console.log(this.usuarioProvider.usuario);

    this.equipe = this.sessaoService.equipe;
    this.tarefa.keyEquipe = this.equipe.$key




    console.log("------------------");
    console.log("isAdministradorEquipe: " + this.isAdministradorEquipe());
    console.log("this.equipe.keyResponsavel");
    console.log(this.equipe.keyResponsavel);
    console.log("this.usuarioProvider.usuario.$key");
    console.log(this.usuarioProvider.usuario.$key);
    
    console.log("isResponsavel: " + this.isResponsavel());
    
    console.log("isSituacao Andamento: " + this.isSituacao(this.enumTarefaSituacao.Andamento));
    console.log("isSituacao Cancelada: " + this.isSituacao(this.enumTarefaSituacao.Cancelada));
    console.log("isSituacao Finalizado: " + this.isSituacao(this.enumTarefaSituacao.Finalizado));
    console.log("isSituacao Pendente: " + this.isSituacao(this.enumTarefaSituacao.Pendente));
    console.log("------------------");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TarefaPage');
  }

  save() {
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom'
    });

    let loading = this.loadingCtrl.create();

    if (this.tarefa.$key) {
      toast.setMessage("Tarefa criada.");
      loading.setContent('Criando Tarefa...');
    } else {
      toast.setMessage("Tarefa alterada.");
      loading.setContent('Alterando Tarefa...');
    }

    loading.present();

    this.tarefaService.save(this.tarefa).then((data) => {
      loading.dismiss();
      toast.present();
      this.navCtrl.pop();
    }).catch((error) => {
      loading.dismiss();
    });

    toast.dismiss();
  }

  selecionarLocal() {
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

  isAdministradorEquipe() {
    let retorno = this.equipe.keyResponsavel == this.usuarioProvider.usuario.$key;
    return retorno;
  }
  
  isResponsavel() {
    let retorno = this.tarefa.keyResponsaveis.indexOf(this.usuarioProvider.usuario.$key) > -1;
    return retorno;
  }

  isSituacao(situacao: TarefaSituacao) {    
    let retorno = this.tarefa.situacao == situacao;
    return retorno;
  }
}
