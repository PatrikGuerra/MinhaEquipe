import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Pages - Modal
import { LocalMapaPage } from "../local-mapa/local-mapa";

//Models
import { Local } from "../../models/local";
import { Equipe } from "../../models/equipe";
import { Coordenadas } from "../../models/coordenadas";

//Providers
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";
import { LocalServiceProvider } from "../../providers/local-service/local-service";

@Component({
  selector: 'page-local',
  templateUrl: 'local.html',
})
export class LocalPage {
  private localForm: FormGroup;
  private local: Local = new Local();
  private localCopia: Local;
  private equipe: Equipe;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public sessaoService: SessaoServiceProvider,
    public usuarioService: UsuarioServiceProvider,
    private localService: LocalServiceProvider) {

    this.localForm = this.formBuilder.group({
      nome: ['', Validators.compose([Validators.required])],
      descricao: [''],
    });

    this.equipe = this.sessaoService.equipe;

    if (this.navParams.data.local) {
      this.local = this.navParams.data.local;
      this.localCopia = this.local.Copy();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocalPage');
  }

  salvar() {
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom'
    });

    let loading = this.loadingCtrl.create();

    if (this.local.$key) {
      loading.setContent('Alterando Local...');
      toast.setMessage("Local alterado.");
    } else {
      loading.setContent('Criando Local...');
      toast.setMessage("Local criado.");
    }

    loading.present();

    this.localService.salvar(this.local, this.equipe.$key).then((data) => {
      loading.dismiss();
      toast.present();
      this.navCtrl.pop();
    }).catch((error) => {
      loading.dismiss();
      console.error(error);
    });

    toast.dismiss();
  }

  public selecionarLocal() {
    let localMapaPage = this.modalCtrl.create(LocalMapaPage, {
      coordenadas: (this.local && this.local.coordenadas) ? this.local.coordenadas : null
    });

    localMapaPage.onDidDismiss((data) => {
      if (data) {
        this.local.coordenadas = <Coordenadas>data.coordenada
      }
    });

    localMapaPage.present();
  }

  public isAdministradorEquipe() {
    let retorno = this.equipe.keyResponsavel == this.usuarioService.getUsuarioAplicacao().$key;
    return retorno;
  }

  public remover() {
    this.localService.getKeyTarefasAssociadas(this.equipe.$key, this.local.$key).then((dataRemover: string[]) => {
      if (dataRemover.length > 0) {
        let mensagem = [];

        dataRemover.forEach(element => {
          this.sessaoService.equipe.tarefas.forEach(tarefa => {
            if (tarefa.$key == element) {
              mensagem.push("'" + tarefa.nome + "'");
            }
          });
        });

        let mensagemStr = "";
        if (mensagem.length == 1) {
          mensagemStr = `Este local não pode ser removido pois está vinculado a tarefa ${mensagem[0]}.`;
        } else if (mensagem.length > 1) {
          mensagemStr = `Este local não pode ser removido pois está vinculado as seguintes tarefas: <br> ${mensagem.join(';<br> ')}.`;
        }

        let alert = this.alertCtrl.create({
          title: 'Remover',
          message: mensagemStr,
          buttons: [
            {
              text: 'Ok',
            }
          ]
        });

        alert.present();
      } else {
        let loading = this.loadingCtrl.create({
          content: "Removendo Local.."
        });

        let toast = this.toastCtrl.create({
          duration: 3000,
          position: 'bottom',
          message: `${this.localCopia.nome} removido com sucesso`
        });

        let alert = this.alertCtrl.create({
          title: 'Remover',
          message: 'Tem certeza que deseja remover este local?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
            },
            {
              text: 'Remover',
              handler: () => {
                loading.present();

                this.localService.remover(this.equipe.$key, this.local.$key).then(data => {
                  loading.dismiss();
                  this.navCtrl.pop();
                  toast.present();
                }).catch(error => {
                  loading.dismiss();
                  console.log(error);
                })
              }
            }
          ]
        });
        alert.present();

      }
    }).catch(error => {
      console.log(error);
    });
  }
}
