import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, ActionSheetController, LoadingController, AlertController, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//Providers
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";

//Components
import { TagsInputComponent } from "../../components/tags-input/tags-input.component";

//Popover
import { PerfilPopoverPage } from "../perfil-popover/perfil-popover";

//Models
import { Usuario } from './../../models/usuario';

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
    private userService: UsuarioServiceProvider,
    public popoverCtrl: PopoverController) {

    let loading = this.loadingCtrl.create({
      content: 'Carregando perfil...'
    });

    loading.present();

    this.userService.getUser().then(userObservable => {
      userObservable.subscribe((usuarioData: Usuario) => {
        this.usuario = usuarioData;

        loading.dismiss();

        if (!this.usuario.tags) {
          this.usuario.tags = [];
        }
      });
    });
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

  menuAlterarFoto() {
    let actionSheet = this.actionsheetCtrl.create({
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            console.log('Camera');
            this.camera()
          }
        },
        {
          text: 'Galeria',
          icon: 'image',
          handler: () => {
            console.log('Galeria');
            this.biblioteca()
          }
        }
      ]
    });

    actionSheet.present();
  }
  camera() {
    let loading = this.loadingCtrl.create({
      content: 'Alterando foto de perfil...'
    });

    this.userService.pictureFromCamera().then((imageData) => {
      loading.present();
      var imagem = 'data:image/jpeg;base64,' + imageData;

      this.userService.atualizarImagem(imagem).then((hue) => {
        loading.dismiss();
      })
    }, (erro) => {
      loading.dismiss();
      console.log(erro);
    });
  }
  biblioteca() {
    let loading = this.loadingCtrl.create({
      content: 'Alterando foto de perfil...'
    });

    this.userService.pictureFromLibray().then((imageData) => {
      loading.present();

      var imagem = 'data:image/jpeg;base64,' + imageData;

      this.userService.atualizarImagem(imagem).then((hue) => {
        loading.dismiss();
      })
    }, (erro) => {
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

    this.userService.save(this.usuario).then((data) => {
      loading.dismiss();
      toast.present();
    });
  }
}
 