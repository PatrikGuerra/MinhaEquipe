import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ActionSheetController, LoadingController } from 'ionic-angular';

//Modal
import { EquipeConvidarPage } from "../equipe-convidar/equipe-convidar";
import { ChatPage } from "../chat/chat";
import { LocaisPage } from "../locais/locais";
import { TarefasPage } from "../tarefas/tarefas";
import { EquipeMembrosPage } from "../equipe-membros/equipe-membros";


import { EquipeContextoPage } from "../equipe-contexto/equipe-contexto";

//Providers
import { EquipeServiceProvider } from "../../providers/equipe-service/equipe-service";
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";

//Models
import { Equipe } from "../../models/equipe";
import { Usuario } from "../../models/usuario";

@Component({
  selector: 'page-equipe',
  templateUrl: 'equipe.html',
})
export class EquipePage {
  private equipe: Equipe = new Equipe();
  private imagemBase64: string = "";

  private usuario: Usuario;

  constructor(
    public navCtrl: NavController,
    private actionsheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navParams: NavParams,
    private equipeService: EquipeServiceProvider,
    private usuarioService: UsuarioServiceProvider,
    private sessaoService: SessaoServiceProvider) {

    this.usuarioService.getUser().then(userObservable => {
      userObservable.subscribe((usuarioData: Usuario) => {
        this.usuario = usuarioData;
      });
    });

    if (this.navParams.data.equipe) {
      let loading = this.loadingCtrl.create({
        content: 'Carregando equipe...'
      });
      loading.present();

      var equipe: Equipe = this.navParams.data.equipe;

      this.equipeService.getEquipe(equipe.$key).subscribe(dataEquipe => {
        this.sessaoService.setEquipe(dataEquipe);
        this.equipe = sessaoService.equipe;

        loading.dismiss();
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipePage');
  }

  save() {
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom'
    });

    let loading = this.loadingCtrl.create();

    if (this.equipe.$key) {
      toast.setMessage("Equipe criada.");
      loading.setContent('Criando equipe...');
    } else {
      toast.setMessage("Equipe alterada.");
      loading.setContent('Alterando equipe...');
    }

    loading.present();

    this.equipeService.save(this.equipe, this.imagemBase64).then((data) => {
      loading.dismiss();
      this.navCtrl.pop();
      toast.present();
    }).catch((error) => {
      loading.dismiss();
      console.error(error);
    });

    toast.dismiss();
  }

  menuAlterarImagem() {
    let actionSheet = this.actionsheetCtrl.create({
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.camera();
          }
        },
        {
          text: 'Galeria',
          icon: 'image',
          handler: () => {
            this.biblioteca();
          }
        }
      ]
    });

    actionSheet.present();
  }
  private camera() {
    let loading = this.loadingCtrl.create();
    loading.present();

    this.equipeService.pictureFromCamera().then((imageData) => {
      this.imagemBase64 = 'data:image/jpeg;base64,' + imageData;
    }).catch((error) => {
      this.imagemBase64 = "";
      console.error(error);
    });

    loading.dismiss();
  }
  private biblioteca() {
    let loading = this.loadingCtrl.create();
    loading.present();

    this.equipeService.pictureFromLibray().then((imageData) => {
      this.imagemBase64 = 'data:image/jpeg;base64,' + imageData;
    }).catch((error) => {
      this.imagemBase64 = "";
      console.error(error);
    });

    loading.dismiss();
  }

  abrirConvidar() {
    this.navCtrl.push(EquipeConvidarPage, {
      equipe: this.equipe
    });
  }

  abrirChat() {
    this.navCtrl.push(ChatPage, {
      equipe: this.equipe,
      usuario: this.usuario
    });
  }

  abrirLocais() {
    this.navCtrl.push(LocaisPage, {
      equipe: this.equipe,
    });
  }

  abrirTarefas() {
    this.navCtrl.push(TarefasPage, {
      equipe: this.equipe,
    });
  }

  abrirMembrosDaEquipe() {
    this.navCtrl.push(EquipeMembrosPage);
  }

  abrirContexto() {
    this.navCtrl.push(EquipeContextoPage);
  }

  /*
  private dataInicioMudou(value) {
    //(ionChange)="dataInicioMudou($event)"
    console.clear();

    console.log("-----------")
    console.log("this.equipe")
    console.log(this.equipe)
    console.log("-----------")
    console.log("value")
    console.log(value)
    console.log("-----------")
    var novaData = new Date(value.year, value.month, value.day, value.hour, value.minute, 0, 0)
    console.log("new Date(value)")
    console.log(novaData)
    console.log("-----------")
    console.log("novaData.toString()")
    console.log(novaData.toString())
    console.log("-----------")
    console.log("novaData.toISOString()")
    console.log(novaData.toISOString())

    if (!this.equipe.dataFim) {
      this.equipe.dataFim = novaData.toISOString();
    }
    //  if (!this.equipe.$key && ) {}
  }
  */
}
