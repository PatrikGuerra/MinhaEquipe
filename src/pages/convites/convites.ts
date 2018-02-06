import { Component } from '@angular/core';
import { IonicPage, NavController, ActionSheetController, NavParams, LoadingController, ToastController } from 'ionic-angular';

//Providers
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";
import { ConviteServiceProvider } from "../../providers/convite-service/convite-service";
import { ChatServiceProvider } from "../../providers/chat-service/chat-service";

//Models
import { ConviteUsuario } from "../../models/conviteUsuario";
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-convites',
  templateUrl: 'convites.html',
})
export class ConvitesPage {
  private convitesUsuario: ConviteUsuario[] = [];
  private observable: Subscription;
  private subscriptionConvites: Subscription = new Subscription();

  constructor(
    public navCtrl: NavController,
    private actionsheetCtrl: ActionSheetController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private conviteService: ConviteServiceProvider,
    private usuarioService: UsuarioServiceProvider,
    private chatService: ChatServiceProvider) { }

  //void Runs when the page has loaded.This event only happens once per page being created.If a page leaves but is cached, then this event will not fire again on a subsequent viewing.The ionViewDidLoad event is good place to put your setup code for the page.
  ionViewDidLoad() {
    console.log("ionViewDidLoad")
    console.log('ionsViewDidLoad ConvitesPage');
  }
  //void Runs when the page is about to enter and become the active page.
  ionViewWillEnter() {
    console.log("ionViewWillEnter")
    let loading = this.loadingCtrl.create({
      content: 'Carregando convites...'
    });

    loading.present();

    this.usuarioService.getuid().then((usuarioUid) => {
      this.subscriptionConvites = this.conviteService.meusConvites(usuarioUid).subscribe((convitesUsuarioData: ConviteUsuario[]) => {
        this.convitesUsuario = convitesUsuarioData;

        loading.dismiss();
      });
    });
  }
  //void Runs when the page has fully entered and is now the active page.This event will fire, whether it was the first load or a cached page.
  ionViewDidEnter() {
    console.log("ionViewDidEnter")

  }
  //void Runs when the page is about to leave and no longer be the active page.
  ionViewWillLeave() {
    console.log("ionViewWillLeave")
    this.subscriptionConvites.unsubscribe();
  }
  
  //void Runs when the page has finished leaving and is no longer the active page.
  ionViewDidLeave() {
    console.log("ionViewDidLeave")

  }
  //void Runs when the page is about to be destroyed and have its elements removed.
  ionViewWillUnload() {
    console.log("ionViewWillUnload")
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
      this.chatService.enviarMensagemMembroEntrou(convite.keyEquipe, convite.keyUsuario);

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
