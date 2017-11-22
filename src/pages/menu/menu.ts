import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav, NavParams } from 'ionic-angular';
import { TabsPage } from './../tabs/tabs';

//Providers
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";

export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  // Basic root for our content view
  rootPage: any; //= 'TabsPage';

  // Reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  pages: PageInterface[] = [
    // { title: 'Tab 2', pageName: 'TabsPage', tabComponent: 'Tabs2Page', index: 1, icon: 'contacts' },
    // { title: 'Special', pageName: 'SpecialPage', icon: 'shuffle' },
    { title: 'Convites', pageName: 'ConvitesPage', icon: 'contacts' },
    // { title: 'Minhas Tarefas', pageName: 'TarefasUsuarioPage', icon: 'document' },
    { title: 'Equipes', pageName: 'EquipeListaPage', icon: 'home' },
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private usuarioService: UsuarioServiceProvider) {
    
    if (this.navParams.data.page) {
      this.nav.setRoot(this.navParams.data.page);
    } else {
      this.rootPage = 'ConvitesPage'
    }
  }

  public abrirPerfil() {
    this.nav.setRoot('PerfilPage')
  }

  openPage(page: PageInterface) {
    let params = {};

    // The index is equal to the order of our tabs inside tabs.ts
    if (page.index) {
      params = { tabIndex: page.index };
    }
    // The active child nav is our Tabs Navigation
    if (this.nav.getActiveChildNav() && page.index != undefined) {
      this.nav.getActiveChildNav().select(page.index);
    } else {
      // Tabs are not active, so reset the root page 
      // In this case: moving to or from SpecialPage
      this.nav.setRoot(page.pageName, params);
    }
  }

  isActive(page: PageInterface) {
    // Again the Tabs Navigation
    let childNav = this.nav.getActiveChildNav();

    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    // Fallback needed when there is no active childnav (tabs not active)
    if (this.nav.getActive() && this.nav.getActive().name === page.pageName) {
      return 'primary';
    }
    return;
  }

}