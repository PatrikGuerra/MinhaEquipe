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

@IonicPage()
@Component({
  selector: 'page-contexto-equipe',
  templateUrl: 'contexto-equipe.html',
})
export class ContextoEquipePage {
  private equipe: Equipe = new Equipe();
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
    private datePicker: DatePicker) {

    this.form = this.formBuilder.group({
      nome: ['', Validators.compose([/*Validators.minLength(3),*/ Validators.required])],
    });

    this.atualizarEquipePagina();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipePage');
  }

  private atualizarEquipePagina() {
    this.equipe = this.sessaoService.equipe;
  }

  private listaMembrosItemPressed(usuarioMembro: Usuario) {
    if (!this.isAdministradorEquipe() || usuarioMembro.$key == this.equipe.keyResponsavel) {
      return;
    }

    var actionSheet = this.actionsheetCtrl.create({
      buttons: [
        {
          text: `Remover ${usuarioMembro.nome}`,
          cssClass: 'corTextoVermelho',
          handler: () => {
            this.removerUsuarioDaEquipe(usuarioMembro);
          }
        }
      ]
    });

    actionSheet.present();
  }

  private removerUsuarioDaEquipe(usuario: Usuario) {
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom',
      message: `O membro '${usuario.nome}' foi removido.`
    });

    let loading = this.loadingCtrl.create({
      content: `Removendo '${usuario.nome}'...`
    });

    loading.present();

    this.equipeService.removerMembro(this.equipe.$key, usuario.$key).then((dataRemoverMembro) => {
      loading.dismiss();
      toast.present();
    }).catch((error) => {
      loading.dismiss();
      console.error(error);
    });
  }

  public salvar() {
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom',
      message: "Equipe alterada."
    });

    let loading = this.loadingCtrl.create({
      content: "Alterando equipe..."
    });

    loading.present();

    this.equipeService.alterar(this.equipe).then((data) => {
      loading.dismiss();
      toast.present();
    }).catch((error) => {
      loading.dismiss();
      console.error(error);
    });

    toast.dismiss();
  }

  private menuAlterarImagem() {
    if (!this.isAdministradorEquipe()) {
      return;
    }

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

    if (this.equipe.fotoUrl) {
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
      content: 'Alterando imagem da equipe...'
    });

    this.equipeService.getPicture(enumOrigem).then((imageData) => {
      loading.present();
      let imagemBase64 = 'data:image/jpeg;base64,' + imageData;

      this.equipeService.atualizarImagem(this.equipe.$key, imagemBase64).then((dataUploadImagem) => {
        this.atualizarEquipePagina();
        loading.dismiss();
      });
    }).catch((error) => {
      this.atualizarEquipePagina();
      loading.dismiss();
      console.error(error);
    });

    loading.dismiss();
  }

  private removerImagem() {
    let loading = this.loadingCtrl.create({
      content: 'Removendo imagem da equipe...'
    });

    loading.present();
    this.equipeService.removerImagem(this.equipe.$key).then((dataRemover) => {
      this.atualizarEquipePagina();
      loading.dismiss();
    }).catch((erro) => {
      loading.dismiss();
      console.log(erro);
    });
  }

  public abrirConvidar() {
    this.navCtrl.push(EquipeConvidarPage, {
      equipe: this.equipe
    });
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
    if (!this.isAdministradorEquipe()) {
      return;
    }

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
    if (!this.isAdministradorEquipe()) {
      return;
    }

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

  dataFormatada(date: Date) {
    //dd/mm/yyyy hh:mm

    if (date == null) {
      return "Selecione uma data e hora";
    }

    // var date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    let formatedMonth = (month.length === 1) ? ("0" + month) : month;
    let day = date.getDate().toString();
    let formatedDay = (day.length === 1) ? ("0" + day) : day;
    let hour = date.getHours().toString();
    let formatedHour = (hour.length === 1) ? ("0" + hour) : hour;
    let minute = date.getMinutes().toString();
    let formatedMinute = (minute.length === 1) ? ("0" + minute) : minute;
    //let second = date.getSeconds().toString();
    //let formatedSecond = (second.length === 1) ? ("0" + second) : second;

    return formatedDay + "/" + formatedMonth + "/" + year + " " + formatedHour + ':' + formatedMinute //+ ':' + formatedSecond;
  }

  private isAdministradorEquipe() {
    let retorno = this.equipe.keyResponsavel == this.usuarioService.usuario.$key;
    return retorno;
  }
}
