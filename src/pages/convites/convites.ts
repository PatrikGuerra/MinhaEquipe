import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

//Providers
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";
import { ConviteServiceProvider } from "../../providers/convite-service/convite-service";

//Models
import { ConviteUsuario } from "../../models/conviteUsuario";

@Component({
  selector: 'page-convites',
  templateUrl: 'convites.html',
})
export class ConvitesPage {
  convites: ConviteUsuario[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private conviteService: ConviteServiceProvider,
    private usuarioService: UsuarioServiceProvider) {

    let loading = this.loadingCtrl.create({
      content: 'Carregando convites...'
    });

    loading.present();

    this.usuarioService.getuid().then((usuarioUid) => {
      this.conviteService.meusConvites(usuarioUid).subscribe((convitesData: ConviteUsuario[]) => {
        this.convites = convitesData;

        loading.dismiss();
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionsViewDidLoad ConvitesPage');
  }

  recusarConvite(convite: ConviteUsuario) {
    let loading = this.loadingCtrl.create();

    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom',
      message: `Você recusou o convite da equipe '${convite.equipe.nome}'`
    });

    loading.present();

    this.conviteService.recusarConvite(convite).then(data => {
      toast.present();
      loading.dismiss();
    });
  }

  aceitarConvite(convite: ConviteUsuario) {
    let loading = this.loadingCtrl.create();

    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom',
      message: `Você entrou na equipe '${convite.equipe.nome}'`
    });

    loading.present();

    this.conviteService.aceitarConvite(convite).then(data => {
      toast.present();
      loading.dismiss();
    });
  }

  isToday(timestamp: number) {
    return new Date(timestamp).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
  }
}
