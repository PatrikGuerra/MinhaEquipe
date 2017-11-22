import { Component } from '@angular/core';
import { IonicPage, Nav, NavController, NavParams, LoadingController } from 'ionic-angular';

//Providers
import { EquipeServiceProvider } from "../../providers/equipe-service/equipe-service";
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";

//Pages
// import { EquipePage } from "../equipe/equipe";

//Models
import { Equipe } from "../../models/equipe";
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";

@IonicPage()
@Component({
  selector: 'page-equipe-lista',
  templateUrl: 'equipe-lista.html',
})
export class EquipeListaPage {
  private equipes: Equipe[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private usuarioService: UsuarioServiceProvider,
    private equipeService: EquipeServiceProvider,

    private sessaoService: SessaoServiceProvider) {

    let loading = this.loadingCtrl.create({
      content: 'Carregando equipes...'
    });

    loading.present();

    this.equipeService.getAll(this.usuarioService.usuario.$key).subscribe((data: Equipe[]) => {
      console.log("data")
      this.equipes = data;
      loading.dismiss();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipeListaPage');
  }

  novaEquipe() {
    this.navCtrl.push('EquipePage', {
      nova: true
    });
  }

  editarEquipe(equipe: Equipe) {
    let loading = this.loadingCtrl.create({
      content: 'Carregando equipe...'
    });

    loading.present();

    // var equipe: Equipe = this.navParams.data.equipe;

    // this.equipeService.getEquipe(equipe.$key).subscribe(dataEquipe => {
    this.sessaoService.setEquipeKey(equipe.$key).then(dataEquipe => { //this.sessaoService.setEquipe(equipe).then(dataEquipe => {
      loading.dismiss();
      this.navCtrl.setRoot('TabsPage')

    });
    // });
  }
  removerEquipe(equipe: Equipe) {
    this.equipeService.remove(equipe.$key);
  }
}
