import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { NavController, ToastController, ActionSheetController, LoadingController } from 'ionic-angular';

//Models
import { Equipe } from "../../models/equipe";

//Providers
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";

//Pages
import { EquipePage } from '../equipe/equipe';
import { ChatPage } from "../chat/chat";
import { EquipeContextoPage } from "../equipe-contexto/equipe-contexto";
import { TarefasPage } from "../tarefas/tarefas";
import { LocaisPage } from "../locais/locais";


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any;
  tab2Root: any;
  tab3Root: any;
  tab4Root: any;
  tab5Root: any;

  private data: {} = {};

  constructor(private navParams: NavParams,
    public sessaoService: SessaoServiceProvider,
    private loadingCtrl: LoadingController, ) {

    this.tab1Root = EquipePage;
    this.tab2Root = ChatPage;
    this.tab3Root = EquipeContextoPage;
    this.tab4Root = TarefasPage;
    this.tab5Root = LocaisPage;

    if (this.navParams.data.equipe) {
      var equipe: Equipe;

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
    }
  }
}
