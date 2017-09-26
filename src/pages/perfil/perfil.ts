import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, ActionSheetController, LoadingController, AlertController, ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

//Page
import { LoginPage } from "../login/login";

//Modal
import { PerfilAlterarEmailPage } from "../perfil-alterar-email/perfil-alterar-email";
import { PerfilAlterarSenhaPage } from "../perfil-alterar-senha/perfil-alterar-senha";

//Providers
import { UserServiceProvider } from "../../providers/user-service/user-service";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

//Components
import { TagsInputComponent } from "../../components/tags-input/tags-input.component";

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  usuario: any = {};

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private actionsheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private userProvider: UserServiceProvider,
    private authService: AuthServiceProvider) {

    this.userProvider.getUser().then(userObservable => {
      userObservable.subscribe(usuarioData => {
        console.log(usuarioData)

        this.usuario = usuarioData;

        if (!this.usuario.tags) {
          this.usuario.tags = [];
        }
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
  }

  alterarSenha() {
    let perfilAlterarSenhaPage = this.modalCtrl.create(PerfilAlterarSenhaPage);

    perfilAlterarSenhaPage.onDidDismiss(data => {
      console.log(data)
    });

    perfilAlterarSenhaPage.present();
  }
  alterarEmail() {
    let perfilAlterarEmailPage = this.modalCtrl.create(PerfilAlterarEmailPage);

    perfilAlterarEmailPage.onDidDismiss(data => {
      console.log(data);
    });

    perfilAlterarEmailPage.present();
  }


  menuAlterarFoto() {
    let actionSheet = this.actionsheetCtrl.create({
      //cssClass: 'action-sheets-basic-page',
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

    this.userProvider.pictureFromCamera().then((imageData) => {
      loading.present();
      var imagem = 'data:image/jpeg;base64,' + imageData;

      this.userProvider.atualizarImagem(imagem).then((hue) => {
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

    this.userProvider.pictureFromLibray().then((imageData) => {
      loading.present();

      var imagem = 'data:image/jpeg;base64,' + imageData;

      this.userProvider.atualizarImagem(imagem).then((hue) => {
        loading.dismiss();
      })
    }, (erro) => {
      loading.dismiss();
      console.log(erro);
    });

    loading._destroy;
  }


  alterarUsuario() {
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom',
      message: "Perfil alterado."
    });

    let loading = this.loadingCtrl.create({
      content: `<div class="loading-custom-spinner-container">
                  <div class="loading-custom-spinner-box"></div>
                </div>
                <div>Alterando informações de perfil...</div>`
    });

    loading.present();

    this.userProvider.updateCurrentUser(this.usuario).then((data) => {
      loading.dismiss();
      toast.present();
    });

    toast.dismiss();
    loading._destroy;
  }

  confirmarLogout() {
    let alert = this.alertCtrl.create({
      title: 'Sair',
      message: 'Você tem certeza que deseja sair?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sair',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    alert.present();
  }
  logout() {
    this.authService.sair().then(() => {
      this.navCtrl.setRoot(LoginPage);
    })
      .catch((error) => {
        console.error(error);
      })
  }
}
