import { Component } from '@angular/core';
import { NavParams, Platform, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-local-select',
  templateUrl: 'local-select.html',
})
export class LocalSelectPage {
  private items: any[];
  private displayProperty: string;
  private title: string;
  private selectedItem: any;
  private keySelected:string;

  constructor(
    public navCtrl: ViewController,
    public navParams: NavParams,
    private platform: Platform) {

    this.initializeItems();

    if(navParams.get('keySelected')) {
      this.keySelected = navParams.get('keySelected');
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

  select(item) {
    this.keySelected = "";
    this.selectedItem = item;
  }

  confirm() {
    this.navCtrl.dismiss(this.selectedItem);
  }

  cancel() {
    this.navCtrl.dismiss();
  }
}