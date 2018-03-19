import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, LoadingController, PopoverController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { DatePicker } from '@ionic-native/date-picker';

//Modal
import { EquipeConvidarPage } from "../equipe-convidar/equipe-convidar";

//Providers
import { EquipeServiceProvider } from "../../providers/equipe-service/equipe-service";
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";

//Enums
import { OrigemImagem } from "../../app/app.constants";

//Models
import { Equipe } from "../../models/equipe";
import { Usuario } from "../../models/usuario";

import { DataHora } from "../../Utils/dataHora";

@IonicPage()
@Component({
  selector: 'page-equipe',
  templateUrl: 'equipe.html',
})
export class EquipePage {
  private equipe: Equipe = new Equipe();
  private imagemBase64: string = "";
  private usuario: Usuario;
  private form: FormGroup;

  constructor(
    public navCtrl: NavController,
    private actionsheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navParams: NavParams,
    private equipeService: EquipeServiceProvider,
    private usuarioService: UsuarioServiceProvider,
    private sessaoService: SessaoServiceProvider,
    private formBuilder: FormBuilder,
    private datePicker: DatePicker,
  
    private dataHora: DataHora) {

    this.form = this.formBuilder.group({
      nome: ['', Validators.compose([/*Validators.minLength(3),*/ Validators.required])],
    });

    this.imagemBase64 = "";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipePage');
  }

  public salvar() {
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom',
      message: "Equipe criada."
    });

    let loading = this.loadingCtrl.create({
      content: "Criando equipe..."
    });

    loading.present();

    this.equipeService.criar(this.equipe, this.imagemBase64).then((data) => {
      loading.dismiss();
      this.navCtrl.pop();
      toast.present();
    }).catch((error) => {
      loading.dismiss();
      console.error(error);
    });

    toast.dismiss();
  }

  private menuAlterarImagem() {
    let actionSheet = this.actionsheetCtrl.create({
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.getImagem(OrigemImagem.Camera);
          }
        },
        {
          text: 'Galeria',
          icon: 'image',
          handler: () => {
            this.getImagem(OrigemImagem.Galeria);
          }
        }
      ]
    });

    if (this.imagemBase64) {
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
    this.equipeService.getPicture(enumOrigem).then((imageData) => {
      this.imagemBase64 = 'data:image/jpeg;base64,' + imageData;
    }).catch((error) => {
      console.error(error);
    });
  }

  private removerImagem() {
    this.imagemBase64 = "";
  }

  private validarDatas(): boolean {
    if (this.equipe.dataInicio && this.equipe.dataFim) {
      if (this.equipe.dataInicio.getTime() <= this.equipe.dataFim.getTime()) {
        return true;
      }
    }

    return false;
  }

  private corClasse() {
    if (this.validarDatas()) {
      return 'dataHoraSucesso';
    } else {
      return 'dataHoraErro';
    }
  }

  public alterarDataInicio() {
    this.getInicioData().then(data => {
      this.getInicioHora().then(horario => {
        data.setHours(horario.getHours());
        data.setMinutes(horario.getMinutes());

        this.equipe.dataInicio = data;
      }).catch(error => {
        console.log(error);
      });
    }).catch(error => {
      console.log(error);
    })
  }
  private getInicioData() {
    return this.datePicker.show({
      mode: 'date',
      date: ((this.equipe.dataInicio == null) ? new Date() : this.equipe.dataInicio),
      //minDate: new Date(),
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      titleText: "Início",
    });
  }
  private getInicioHora() {
    return this.datePicker.show({
      mode: 'time',
      date: ((this.equipe.dataInicio == null) ? new Date() : this.equipe.dataInicio),
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      is24Hour: true,
      titleText: "Início",
    });
  }

  public alterarDataTermino() {
    this.getTerminoData().then(data => {
      this.getTerminoHora().then(horario => {
        data.setHours(horario.getHours());
        data.setMinutes(horario.getMinutes());

        this.equipe.dataFim = data;
      }).catch(error => {
        console.log(error);
      });
    }).catch(error => {
      console.log(error);
    })
  }
  private getTerminoData() {
    return this.datePicker.show({
      mode: 'date',
      date: ((this.equipe.dataFim == null) ? new Date() : this.equipe.dataFim),
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      titleText: "Término",
    })
  }
  private getTerminoHora() {
    return this.datePicker.show({
      mode: 'time',
      date: ((this.equipe.dataFim == null) ? new Date() : this.equipe.dataFim),
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      is24Hour: true,
      titleText: "Término",
    });
  }
}
