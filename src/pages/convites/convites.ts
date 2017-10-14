import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//Provider
import { ConviteServiceProvider } from "../../providers/convite-service/convite-service";

@Component({
  selector: 'page-convites',
  templateUrl: 'convites.html',
})
export class ConvitesPage {
  convites: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private conviteService: ConviteServiceProvider) {


  }

  private carregar() {
    this.conviteService.convites().then(data => {
      this.convites = data
      console.log(data)
    });
  }

  ionViewDidLoad() {
    this.carregar();
    console.log('ionViewDidLoad ConvitesPage');

    // this.conviteService.convites().then((data) => {
    //   console.log(data)
    // });
    //console.log()
  }

  private recusarConvite(convite: any) {
    this.conviteService.recusarConvite(convite);

    console.log(convite);

    this.convites.forEach((element, index) => {
      if (element.$key == convite.$key) {
        this.convites.splice(index, 1);
      }
    });
  }

  private aceitarConvite(convite: any) {
    this.conviteService.aceitarConvite(convite);

    this.convites.forEach((element, index) => {
      if (element.$key == convite.$key) {
        this.convites.splice(index, 1);
      }
    });
    console.log(convite);
  }

}
