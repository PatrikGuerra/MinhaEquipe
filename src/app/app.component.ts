import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireAuth } from "angularfire2/auth";

//Paginas
import { HomePage } from '../pages/home/home';
import { CadastroPage } from "../pages/cadastro/cadastro";
import { EsqueciSenhaPage } from "../pages/esqueci-senha/esqueci-senha";
import { LoginPage } from "../pages/login/login";
import { PerfilPage } from "../pages/perfil/perfil";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
 // rootPage:any = HomePage;
  rootPage:any;

  constructor(
    platform: Platform, 
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    afAuth: AngularFireAuth) {


    const authObserver = afAuth.authState.subscribe(user => {
    //  console.log(JSON.stringify(user));
      if (user) {
         this.rootPage = HomePage;
        //authObserver.unsubscribe();
      } else {
        this.rootPage = LoginPage;
        //authObserver.unsubscribe();
      }
      authObserver.unsubscribe();
    });
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

