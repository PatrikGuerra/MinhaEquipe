import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

//Providers
import { EquipeServiceProvider } from "../../providers/equipe-service/equipe-service";
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";

//Pages
import { EquipePage } from "../equipe/equipe";

//Models
import { Equipe } from "../../models/equipe";

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
    private equipeService: EquipeServiceProvider) {

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
    this.navCtrl.push(EquipePage);
  }

  editarEquipe(equipe: Equipe) {
    this.navCtrl.push(EquipePage, {
      equipe: equipe
    });
  }
  removerEquipe(equipe: Equipe) {
    this.equipeService.remove(equipe.$key);
  }
}
