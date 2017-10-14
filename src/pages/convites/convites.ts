import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//Provider
import { UserServiceProvider } from "../../providers/user-service/user-service";
import { ConviteServiceProvider } from "../../providers/convite-service/convite-service";

import { ConviteUsuario } from "../../models/conviteUsuario";

@Component({
  selector: 'page-convites',
  templateUrl: 'convites.html',
})
export class ConvitesPage {
  convites: ConviteUsuario[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private conviteService: ConviteServiceProvider,
    private userService: UserServiceProvider) {

    this.userService.getuid().then((usuarioUid) => {
      this.conviteService.convites(usuarioUid).subscribe((convitesData: ConviteUsuario[]) => {
        this.convites = convitesData;
      });
    });
  }

  // private carregar() {
  //   this.conviteService.convites().then(data => {
  //     this.convites = data
  //     console.log(data)
  //   });
  // }

  ionViewDidLoad() {
    //this.carregar();
    console.log('ionsViewDidLoad ConvitesPage');

    // this.conviteService.convites().then((data) => {
    //   console.log(data)
    // });
    //console.log()
  }

  private recusarConvite(convite: ConviteUsuario) {
    // this.conviteService.recusarConvite(convite);

    // console.log(convite);

    // this.convites.forEach((element, index) => {
    //   if (element.$key == convite.$key) {
    //     this.convites.splice(index, 1);
    //   }
    // });
  }

  private aceitarConvite(convite: ConviteUsuario) {
    // this.conviteService.aceitarConvite(convite);

    // this.convites.forEach((element, index) => {
    //   if (element.$key == convite.$key) {
    //     this.convites.splice(index, 1);
    //   }
    // });
    // console.log(convite);
  }

}
