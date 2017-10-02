import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

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

    if (this.navParams.data.equipe) {
      this.convite.equipe = this.navParams.data.equipe;

      console.log("---- EquipeConvidarPage");
      console.log(this.convite);
      console.log("---- EquipeConvidarPage");
    }

    this.conviteForm = this.formBuilder.group({
      listaEmail: this.formBuilder.array([
        this.novoEmail(),
      ])
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipeConvidarPage');
  }

  private novoEmail() {
    return this.formBuilder.group({
      //https://stackoverflow.com/questions/41166571/email-validation-is-not-working-in-angular-2-form-validation
      email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)])
    });
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
    let loading
    this.mapearListaEmail();

    console.log(this.convite)
  }

  private mapearListaEmail() {
    var listaEmail: string[] = [];

    this.conviteForm.value['listaEmail'].forEach(element => {
      listaEmail.push(this.trim(element['email']));
    });

    listaEmail = this.uniqueValue(listaEmail);

    this.convite.emails = listaEmail;
  }

  private trim(str) {
    return str.replace(/^\s+|\s+$/g, "");
  }

  private uniqueValue(myArray: any) {
    return myArray.filter(function (item, pos, self) {
      return self.indexOf(item) == pos;
    })
  }
}
