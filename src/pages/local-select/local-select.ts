import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-local-select',
  templateUrl: 'local-select.html',
})
export class LocalSelectPage {
  items: any[];
  displayProperty: string;
  title: string;
  selectedItem: any;
  searchQuery: string;

  keySelected:string;


  // navParams.get('displayProperty');
  // navParams.get('title');
  // navParams.get('items');

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

    platform.registerBackButtonAction(() => {
      this.cancel();
    });
  }

  initializeItems() {
    this.items = this.navParams.get('items');
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
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