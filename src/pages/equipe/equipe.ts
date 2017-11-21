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
    private datePicker: DatePicker) {

    this.form = this.formBuilder.group({
      nome: ['', Validators.compose([Validators.minLength(3), Validators.required])],
    });

    if (this.navParams.data.nova) {
    } else {
      this.equipe = sessaoService.equipe;
    }
    console.log(this.equipe)


    // if (this.navParams.data.equipe) {
    //   let loading = this.loadingCtrl.create({
    //     content: 'Carregando equipe...'
    //   });
    //   loading.present();

    //   var equipe: Equipe = this.navParams.data.equipe;

    //   this.equipeService.getEquipe(equipe.$key).subscribe(dataEquipe => {
    //     this.sessaoService.setEquipe(dataEquipe);
    //     this.equipe = sessaoService.equipe;

    //     loading.dismiss();
    //   });
    // }
  }

  private itemPressed(usuario: Usuario) {
    if (usuario.$key == this.equipe.keyResponsavel) {
      return;
    }

    var actionSheet = this.actionsheetCtrl.create({
      buttons: [
        {
          text: `Remover ${usuario.nome}`,
          cssClass: 'corTextoVermelho',
          handler: () => {

          }
        }
      ]
    });

    actionSheet.present();

    console.log("itemPressed")
    console.log(usuario.nome)
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
      loading.setContent('Alterando equipe...');
      toast.setMessage("Equipe alterada.");
    } else {
      loading.setContent('Criando equipe...');
      toast.setMessage("Equipe criada.");
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

    actionSheet.present();
  }

  private getImagem(enumOrigem: OrigemImagem) {
    let loading = this.loadingCtrl.create({
      content: 'Alterando imagem da equipe...'
    });

    if (this.equipe.$key) {
      loading.setContent('Alterando imagem da equipe...')
    }

    this.equipeService.getPicture(enumOrigem).then((imageData) => {
      loading.present();
      this.imagemBase64 = 'data:image/jpeg;base64,' + imageData;

      if (this.equipe.$key) {
        this.equipeService.atualizarImagem(this.equipe.$key, this.imagemBase64).then((dataUploadImagem) => {
          loading.dismiss();
        });
      } else {
        loading.dismiss();
      }
    }).catch((error) => {
      this.imagemBase64 = "";
      loading.dismiss();
      console.error(error);
    });

    loading.dismiss();
  }

  public abrirConvidar() {
    this.navCtrl.push(EquipeConvidarPage, {
      equipe: this.equipe
    });
  }

  public alterarDataIncio() {
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


  isAdministradorEquipe() {
    let retorno = this.equipe.keyResponsavel == this.usuarioService.usuario.$key;
    return retorno;
  }
}
