import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';

//Models
import { Equipe } from "../../models/equipe";

//Providers
import { ConviteServiceProvider } from "../../providers/convite-service/convite-service";

@Component({
  selector: 'page-equipe-convidar',
  templateUrl: 'equipe-convidar.html',
})
export class EquipeConvidarPage {
  public conviteForm: FormGroup;
  private equipe: Equipe;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private conviteServiceProvider: ConviteServiceProvider) {

    if (this.navParams.data.equipe) {
      this.equipe = this.navParams.data.equipe;
    }

    this.conviteForm = this.formBuilder.group({
      listaEmail: this.formBuilder.array([
        this.novoEmail(),
      ])
    });

  }
  private novoEmail() {
    return this.formBuilder.group({
      //https://stackoverflow.com/questions/41166571/email-validation-is-not-working-in-angular-2-form-validation
      email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)])
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipeConvidarPage');
  }

  private adicionarEmail() {
    const control = <FormArray>this.conviteForm.controls['listaEmail'];
    control.push(this.novoEmail());
  }

  private removerEmail(indice: number) {
    const control = <FormArray>this.conviteForm.controls['listaEmail'];
    control.removeAt(indice);
  }

  private enviar() {
    let loading = this.loadingCtrl.create({
      content: `Enviando convites...`
    })

    let toast = this.toastCtrl.create({
      message: `Convites enviados com sucesso.`,
      duration: 3000
    })

    loading.present();

    var emails: string[] = [];
    this.conviteForm.value['listaEmail'].forEach(element => {
      emails.push(element['email']);
    });

    this.conviteServiceProvider.enviarConvites(emails, this.equipe.$key).then(data => {
      loading.dismiss();
      toast.present();
    })
  }
}
