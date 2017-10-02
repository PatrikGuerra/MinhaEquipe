import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

//Providers
import { EquipeServiceProvider } from "../../providers/equipe-service/equipe-service";
import { UserServiceProvider } from "../../providers/user-service/user-service";

//Pages
import { EquipePage } from "../equipe/equipe";
import { Equipe } from "../../models/equipe";

@Component({
  selector: 'page-equipe-lista',
  templateUrl: 'equipe-lista.html',
})
export class EquipeListaPage {
  private equipes: Equipe[] = [];//FirebaseListObservable<Equipe[]>;
  private usuarioUid: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,

    public db: AngularFireDatabase,
    private userService: UserServiceProvider,
    private equipeService: EquipeServiceProvider) {

    this.userService.getuid().then((usuarioUid) => {
      this.usuarioUid = usuarioUid;

      this.equipeService.getAll(usuarioUid).then(userObservable => {
        userObservable.subscribe((equipesData: Equipe[]) => {

          console.log(equipesData);
          //equipesData.sort()

          // equipesData.sort(function(a, b){
            
          //   if(a.$key < b.$key) return -1;
          //   if(a.$key > b.$key) return 1;
          //   if(a.timestamp < b.timestamp) return -1;
          //   if(a.timestamp >b.timestamp) return 1;
          //   return 0;
          // });

          this.equipes = equipesData;
        });
      });
    });
  }

  // private compare(a, b) {
  //   if (a.last_nom < b.last_nom)
  //     return -1;
  //   if (a.last_nom > b.last_nom)
  //     return 1;
  //   return 0;
  // }

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
    this.equipeService.remove(equipe.$key);
  }
}
