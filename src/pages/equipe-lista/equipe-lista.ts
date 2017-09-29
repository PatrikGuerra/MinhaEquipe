import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

//Providers
import { EquipeServiceProvider } from "../../providers/equipe-service/equipe-service";

//Pages
import { EquipePage } from "../equipe/equipe";
import { Equipe } from "../../models/equipe";

@Component({
  selector: 'page-equipe-lista',
  templateUrl: 'equipe-lista.html',
})
export class EquipeListaPage {
  equipes: Equipe[] = [];//FirebaseListObservable<Equipe[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private equipeProvider: EquipeServiceProvider,
    public db: AngularFireDatabase) {

    this.equipeProvider.getAll().then(userObservable => {
      userObservable.subscribe((equipesData: Equipe[]) => {
    
        console.log(equipesData);

        this.equipes = equipesData;
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipeListaPage');
  }

  novaEquipe() {
    this.navCtrl.push(EquipePage);
  }

  editarEquipe(equipe: Equipe) {
    this.navCtrl.push(EquipePage, {
       equipe: equipe
       });
  }

  removerEquipe(equipe: Equipe) {
    this.equipeProvider.remove(equipe.$key);
  }



  archive() {
  }
  buttonClick() {

  }
}
