import { Component } from '@angular/core';
import { NavParams, Platform, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-usuario-select',
  templateUrl: 'usuario-select.html',
})
export class UsuarioSelectPage {
  private items: any[] = [];
  private displayProperty: string = "";
  private title: string = "";
  private selectedItens: string[] = [];

  // 'selectedItens'
  // 'displayProperty'
  // 'title'
  // 'items'

  constructor(
    public navCtrl: ViewController,
    public navParams: NavParams,
    private platform: Platform) {

    console.log("navParams.data")
    console.log(navParams.data)

    this.initializeItems();

    if (navParams.get('selectedItens')) {
      this.selectedItens = navParams.get('selectedItens');
    }

    this.displayProperty = navParams.get('displayProperty');
    this.title = navParams.get('title');

    if (!this.title) {
      this.title = 'Pesquisar...';
    }

    this.platform.registerBackButtonAction(() => {
      this.cancel();
    });
  }

  initializeItems() {
    this.items = this.navParams.get('items');
  }

  getItems(ev: any) {
    this.initializeItems();

    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item[this.displayProperty].toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  select(key) {
    var index = this.selectedItens.indexOf(key);

    if (index > -1) {
      this.selectedItens.splice(index, 1);
    } else {
      this.selectedItens.push(key)
    }
  }

  confirm() {
    this.navCtrl.dismiss({
      'keys': this.selectedItens
    });
  }

  cancel() {
    this.navCtrl.dismiss();
  }
}
