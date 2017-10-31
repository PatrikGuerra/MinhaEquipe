import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Pages - Modal
import { LocalMapaPage } from "../local-mapa/local-mapa";
import { LocalSelectPage } from "../local-select/local-select";
import { UsuarioSelectPage } from "../usuario-select/usuario-select";

//Models
import { Tarefa } from "../../models/tarefa";
import { Equipe } from "../../models/equipe";

//Providers
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";
import { TarefaServiceProvider } from "../../providers/tarefa-service/tarefa-service";
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";

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

    this.equipe = this.sessaoService.equipe;
    this.tarefa.keyEquipe = this.equipe.$key
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




}
