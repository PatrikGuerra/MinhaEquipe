import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';

//Models
import { EquipeConvite } from "../../models/equipeConvite";

@Component({
  selector: 'page-equipe-convidar',
  templateUrl: 'equipe-convidar.html',
})
export class EquipeConvidarPage {
  private convite: EquipeConvite = new EquipeConvite();
  public conviteForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder) {

    this.conviteForm = this.formBuilder.group({
      listaEmail: this.formBuilder.array([
        this.novoEmail(),
      ])
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipeConvidarPage');
  }

  novoEmail() {
    return this.formBuilder.group({
      //https://stackoverflow.com/questions/41166571/email-validation-is-not-working-in-angular-2-form-validation
      email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)])
    });
  }

  adicionarEmail() {
    const control = <FormArray>this.conviteForm.controls['listaEmail'];
    control.push(this.novoEmail());
  }

  removerEmail(indice: number) {
    const control = <FormArray>this.conviteForm.controls['listaEmail'];
    control.removeAt(indice);
  }

  enviar() {
    this.mapearListaEmail();

    console.log(this.convite)
  }

  private mapearListaEmail() {
    this.conviteForm.value['listaEmail'].forEach(element => {
      this.convite.emails.push(element['email']);
    });
  }
}
