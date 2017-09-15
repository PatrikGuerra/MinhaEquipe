import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

//Storage
import { IonicStorageModule } from "@ionic/storage";

//Firebase
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireDatabaseModule } from 'angularfire2/database';


//Paginas
import { HomePage } from '../pages/home/home';
import { CadastroPage } from "../pages/cadastro/cadastro";
import { EsqueciSenhaPage } from "../pages/esqueci-senha/esqueci-senha";
import { LoginPage } from "../pages/login/login";
import { PerfilPage } from "../pages/perfil/perfil";

//Providers
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { UserServiceProvider } from "../providers/user-service/user-service";



//Configuracao Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDlEO52-eaJInj1sqL6gdraZ1CV5Cvh150",
  authDomain: "minha-equipe.firebaseapp.com",
  databaseURL: "https://minha-equipe.firebaseio.com",
  projectId: "minha-equipe",
  storageBucket: "minha-equipe.appspot.com",
  messagingSenderId: "357623072399"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
      CadastroPage,
      EsqueciSenhaPage,
      LoginPage,
      PerfilPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(), //Storage
    AngularFireModule.initializeApp(firebaseConfig), //Novo -- Firebase
    AngularFireAuthModule,
    AngularFireDatabaseModule //Novo -- Firebase
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
      CadastroPage,
      EsqueciSenhaPage,
      LoginPage,
      PerfilPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    UserServiceProvider 
  ]
})
export class AppModule {}
