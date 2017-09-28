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
  equipes: FirebaseListObservable<Equipe[]>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private equipeProvider: EquipeServiceProvider,
    public db: AngularFireDatabase) {

      console.log("carregando")

      //this.equipes = this.db.list("/equipes");
      this.equipeProvider.getAll().subscribe(items => {
        // items is an array
        items.forEach(item => {
          console.log('Item:', item);
          console.log(item.$key);
          console.log(item.dataInicio);
          console.log(item.dataFim);
          console.log(item.nome);
          console.log(item.responsavel);
          
        });
        //this.equipes = items.
  });
      
   

/*
    this.db.list('/equipes', { preserveSnapshot: true}).subscribe(snapshots=>{
      console.log(snapshots);
      snapshots.forEach(snapshot => {
        console.log(snapshot.key, snapshot.val());
      });*/
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipeListaPage');
  }

  novaEquipe() {
    this.navCtrl.push(EquipePage);
  }

  editarEquipe(equipe: any) {
    this.navCtrl.push(EquipePage, { equipe: equipe });
  }

  removerEquipe(equipe: any) {
    this.equipeProvider.remove(equipe.$key);
  }



  archive() {
  }
  buttonClick() {

  }
}
