import { Component } from '@angular/core';

//Providers
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";

@Component({
  selector: 'page-equipe-membros',
  templateUrl: 'equipe-membros.html',
})
export class EquipeMembrosPage {

  constructor(
    public sessaoProvider: SessaoServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipeMembrosPage');
  }
}
