import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, ActionSheetController, LoadingController, AlertController, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//Providers
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";

//Components
//  import { TagsInputComponent } from "../../components/tags-input/tags-input.component";

//Popover
import { PerfilPopoverPage } from "../perfil-popover/perfil-popover";

//Enums
import { OrigemImagem } from "../../app/app.constants";

//Models
import { Usuario } from './../../models/usuario';

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  private usuario: Usuario = new Usuario();

  private imagemBase64: string = "";
  private enumOrigemImagem = OrigemImagem;

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private actionsheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private usuarioService: UsuarioServiceProvider,
    public popoverCtrl: PopoverController) {

    this.usuario = this.usuarioService.usuario

    if (!this.usuario.tags) {
      this.usuario.tags = [];
    }

    // let loading = this.loadingCtrl.create({
    //   content: 'Carregando perfil...'
    // });

    // loading.present();

    // this.usuarioService.getUser().then(userObservable => {
    //   userObservable.subscribe((usuarioData: Usuario) => {
    //     this.usuario = usuarioData;
    //     loading.dismiss();

    //     if (!this.usuario.tags) {
    //       this.usuario.tags = [];
    //     }
    //   });
    // });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
  }

  public abrirPopover(myEvent) {
    let perfilPopoverPage = this.popoverCtrl.create(PerfilPopoverPage);

    perfilPopoverPage.present({
      ev: myEvent
    });
  }

  private menuAlterarFoto() {
    let actionSheet = this.actionsheetCtrl.create({
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.getImagem(OrigemImagem.Camera)
          }
        },
        {
          text: 'Galeria',
          icon: 'image',
          handler: () => {
            this.getImagem(OrigemImagem.Galeria)
          }
        }
      ]
    });

    actionSheet.present();
  }
  private getImagem(enumOrigem: OrigemImagem) {
    let loading = this.loadingCtrl.create({
      content: 'Alterando foto de perfil...'
    });

    this.usuarioService.getPicture(enumOrigem).then((imageData) => {
      loading.present();
      this.imagemBase64 = 'data:image/jpeg;base64,' + imageData;

      this.usuarioService.atualizarImagem(this.imagemBase64).then((dataUploadImagem) => {
        loading.dismiss();
      });
    }, (erro) => {
      this.imagemBase64 = "";
      loading.dismiss();
      console.log(erro);
    });
  }

  alterarUsuario() {
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom',
      message: "Perfil alterado."
    });

    let loading = this.loadingCtrl.create({
      content: 'Alterando informações de perfil...'
    });

    loading.present();

    this.usuarioService.save(this.usuario).then((data) => {
      loading.dismiss();
      toast.present();
    });
  }
}
