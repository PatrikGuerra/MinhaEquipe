import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { IonicPage, App, Nav } from 'ionic-angular';
//Providers
import { EquipeServiceProvider } from "../../providers/equipe-service/equipe-service";
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";

//Pages
import { EquipePage } from "../equipe/equipe";
import { TabsPage } from "../tabs/tabs";

//Models
import { Equipe } from "../../models/equipe";
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";
@Component({
  selector: 'page-equipe-lista',
  templateUrl: 'equipe-lista.html',
})
export class EquipeListaPage {
  private equipes: Equipe[] = [];
  private usuarioUid: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private usuarioService: UsuarioServiceProvider,
    private equipeService: EquipeServiceProvider,

    private sessaoService: SessaoServiceProvider,
    private app: App) {

    let loading = this.loadingCtrl.create({
      content: 'Carregando equipes...'
    });

    loading.present();

    this.usuarioService.getuid().then((usuarioUid) => {
      this.usuarioUid = usuarioUid;

      this.equipeService.getAll(usuarioUid).subscribe((data: Equipe[]) => {
        console.log("data")
        this.equipes = data;
        loading.dismiss();
      });

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipeListaPage');
  }

  novaEquipe() {
    this.navCtrl.push(EquipePage, {
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
      this.app.getRootNav().setRoot(TabsPage);
    });
    // });

    // this.app.getRootNav().setRoot(TabsPage, { 
    //   equipe: equipe
    // });

    //this.navCtrl.setRoot(YourPage, { myData: "test data" })
    // this.navCtrl.push(EquipePage, {
    //   equipe: equipe
    // });
  }
  removerEquipe(equipe: Equipe) {
    this.equipeService.remove(equipe.$key);
  }
}
