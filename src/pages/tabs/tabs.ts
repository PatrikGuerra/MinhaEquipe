import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { IonicPage, NavController, ToastController, ActionSheetController, LoadingController } from 'ionic-angular';

//Models
import { Equipe } from "../../models/equipe";

//Providers
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";

//Pages
import { EquipeListaPage } from '../equipe-lista/equipe-lista';
import { ContextoEquipePage } from '../contexto-equipe/contexto-equipe';
import { ChatPage } from "../chat/chat";
import { EquipeContextoPage } from "../equipe-contexto/equipe-contexto";
import { TarefasPage } from "../tarefas/tarefas";
import { LocaisPage } from "../locais/locais";

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = 'ContextoEquipePage'
  tab2Root: any = 'ChatPage'
  tab3Root: any = 'EquipeContextoPage'
  tab4Root: any = 'TarefasPage'
  tab5Root: any = 'LocaisPage'

  myIndex: number;
  private data: {} = {};

  constructor(private navParams: NavParams,
    public sessaoService: SessaoServiceProvider,
    private loadingCtrl: LoadingController) {

      // if (this.navParams.data.equipe) {
    //   var equipe: Equipe;

    //   equipe = this.navParams.data.equipe
    //   console.log(equipe)

    //   let loading = this.loadingCtrl.create({
    //     content: 'Carregando equipe...'
    //   });

    //   loading.present();

    //   this.sessaoService.setEquipeKey(equipe.$key).then(data => {
    //     loading.dismiss();
    //     this.data['equipe'] = equipe
    //   });
    // }

    this.myIndex = navParams.data.tabIndex || 0;
  }
}
