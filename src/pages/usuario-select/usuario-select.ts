import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-usuario-select',
  templateUrl: 'usuario-select.html',
})
export class UsuarioSelectPage {
  private items: any[] = [];
  private displayProperty: string = "";
  private title: string  = "";
  private selectedItens: string[] = [];
  private searchQuery: string  = "";

  // navParams.get('displayProperty');
  // navParams.get('items');
  // navParams.get('selectedItens')) {
  // navParams.get('title');

  constructor(
    public navCtrl: ViewController,
    public navParams: NavParams,
    private platform: Platform) {

console.log("items")
console.log(this.items)
console.log("displayProperty")
console.log(this.displayProperty)
console.log("title")
console.log(this.title)
console.log("selectedItens")
console.log(this.selectedItens)
console.log("searchQuery")
console.log(this.searchQuery)

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
