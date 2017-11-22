import { Component } from '@angular/core';
import { IonicPage, NavController, ActionSheetController, NavParams, LoadingController, ToastController } from 'ionic-angular';

//Providers
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";
import { ConviteServiceProvider } from "../../providers/convite-service/convite-service";

//Models
import { ConviteUsuario } from "../../models/conviteUsuario";

@IonicPage()
@Component({
  selector: 'page-convites',
  templateUrl: 'convites.html',
})
export class ConvitesPage {
  private convitesUsuario: ConviteUsuario[] = [];

  constructor(
    public navCtrl: NavController,
    private actionsheetCtrl: ActionSheetController,
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
      this.conviteService.meusConvites(usuarioUid).subscribe((convitesUsuarioData: ConviteUsuario[]) => {
        this.convitesUsuario = convitesUsuarioData;

        loading.dismiss();
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionsViewDidLoad ConvitesPage');
  }

  private recusarConvite(convite: ConviteUsuario) {
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

  private aceitarConvite(convite: ConviteUsuario) {
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

  private isToday(timestamp: number) {
    return new Date(timestamp).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
  }

  private opcoesConvite(conviteUsuario: ConviteUsuario) {
    var actionSheet = this.actionsheetCtrl.create({
      title: conviteUsuario.equipe.nome,
      buttons: [
        {
          text: `Aceitar`,
          cssClass: 'corTextoPrimaria',
          icon: 'checkmark',
          handler: () => {
            this.aceitarConvite(conviteUsuario);
          }
        },
        {
          text: `Recusar`,
          icon: 'trash',
          cssClass: 'corTextoVermelho',
          handler: () => {
            this.recusarConvite(conviteUsuario);
          }
        }
      ]
    });

    actionSheet.present();
  }
}
