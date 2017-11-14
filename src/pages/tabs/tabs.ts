import { Component } from '@angular/core';

// import { NavController, ViewController, ModalController, AlertController } from 'ionic-angular';
// import { IonicPage, App, Nav } from 'ionic-angular';
import { NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';

import { EquipePage } from '../equipe/equipe';
import { ChatPage } from "../chat/chat";
//import { ContactPage } from '../contact/contact';
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";
import { NavController, ToastController, ActionSheetController, LoadingController } from 'ionic-angular';

import { Equipe } from "../../models/equipe";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab0Root: any;
  tab1Root: any;
  tab2Root: any;

  private data: {} = {};

  constructor(private navParams: NavParams,
    public sessaoService: SessaoServiceProvider,
    private loadingCtrl: LoadingController, ) {

    this.tab0Root = HomePage;
    this.tab1Root = EquipePage;
    this.tab2Root = ChatPage;

    if (this.navParams.data.equipe) {
      var equipe : Equipe;

      equipe = this.navParams.data.equipe
      console.log(equipe)
      
      
      
      let loading = this.loadingCtrl.create({
        content: 'Carregando equipe...'
      });
      
      loading.present();
      
      this.sessaoService.setEquipeKey(equipe.$key).then(data => {
        
        loading.dismiss();
        this.data['equipe'] = equipe

      });
    } else {
      this.definirPaginas();
    }
  }

  private definirPaginas() {
    this.tab0Root = HomePage;
    this.tab1Root = EquipePage;
    this.tab2Root = ChatPage;
  }
}
