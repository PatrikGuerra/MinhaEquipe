import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


//Providers
import { EquipeServiceProvider } from "../../providers/equipe-service/equipe-service";
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";

//Models
import { Equipe } from "../../models/equipe";
import { Usuario } from "../../models/usuario";

@Component({
  selector: 'page-equipe-membros',
  templateUrl: 'equipe-membros.html',
})
export class EquipeMembrosPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public sessaoProvider: SessaoServiceProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipeMembrosPage');
  }

}
