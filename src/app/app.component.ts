import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from "angularfire2/auth";

//Pages
import { EquipeListaPage } from "../pages/equipe-lista/equipe-lista";
import { TabsPage } from '../pages/tabs/tabs';

//Providers
import { UsuarioServiceProvider } from '../providers/usuario-service//usuario-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public usuarioService: UsuarioServiceProvider,
    afAuth: AngularFireAuth) {


    const authObserver = afAuth.authState.subscribe(user => {
      if (user) {
        console.log("logado")
        console.log(user);

        this.usuarioService.setUsuarioAplicacao(user.uid).then(data => {
          this.rootPage = EquipeListaPage;
          console.log(this.usuarioService.usuario)
        });

        //authObserver.unsubscribe();
      } else {
        console.log("Não logado")        
        this.rootPage = 'LoginPage';
        authObserver.unsubscribe();
      }
    //  authObserver.unsubscribe();
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      
    });
  }
}

