import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, ActionSheetController, LoadingController, AlertController, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//Providers
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";

//Popover
import { PerfilPopoverPage } from "../perfil-popover/perfil-popover";

//Enums
import { OrigemImagem } from "../../app/app.constants";

//Models
import { Usuario } from './../../models/usuario';
import { ActionSheet } from 'ionic-angular/components/action-sheet/action-sheet';

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  private usuario: Usuario = new Usuario();

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private actionsheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private usuarioService: UsuarioServiceProvider,
    public popoverCtrl: PopoverController) {

    this.atualizarUsuarioPagina();
  }

  private atualizarUsuarioPagina() {
    this.usuario = this.usuarioService.usuario;
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

    if (this.usuario.fotoUrl) {
      actionSheet.addButton({
        text: 'Remover',
        icon: 'trash',
        cssClass: 'corTextoVermelho',
        handler: () => {
          this.removerImagem()
        }
      });
    }

    actionSheet.present();
  }

  private getImagem(enumOrigem: OrigemImagem) {
    let loading = this.loadingCtrl.create({
      content: "Alterando foto de perfil..."
    });

    this.usuarioService.getPicture(enumOrigem).then((imageData) => {
      loading.present();
      let imagemBase64 = 'data:image/jpeg;base64,' + imageData;

      this.usuarioService.atualizarImagem(imagemBase64).then((dataUploadImagem) => {
        this.atualizarUsuarioPagina();
        loading.dismiss();
      });
    }).then((erro) => {
      loading.dismiss();
      console.log(erro);
    });
  }

  private removerImagem() {
    let loading = this.loadingCtrl.create({
      content: 'Removendo foto de perfil...'
    });

    loading.present();
    this.usuarioService.removerImagem(this.usuario.$key).then((dataRemover) => {
      this.atualizarUsuarioPagina();
      loading.dismiss();
    }).catch((erro) => {
      loading.dismiss();
      console.log(erro);
    });
  }

  public alterarUsuario() {
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom',
      message: "Perfil alterado."
    });

    let loading = this.loadingCtrl.create({
      content: 'Alterando informações de perfil...'
    });

    loading.present();

    this.usuarioService.salvar(this.usuario).then((data) => {
      console.log(this.usuario);
      loading.dismiss();
      toast.present();
    }).catch(error => {
      console.log(error);
      loading.dismiss();
    });
  }

  // bindTagAdicionada(e) {
  //   console.log("bindTagAdicionada");
  //   console.log(e);
  // }

  // bindTagRemovida(e) {
  //   console.log("bindTagRemovida");
  //   console.log(e);
  // }
}
