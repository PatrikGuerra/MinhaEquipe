import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

//Firebase
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";

//Paginas
import { HomePage } from '../pages/home/home';

//Providers
import { AuthServiceProvider } from '../providers/auth-service/auth-service';



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
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig), //Novo -- Firebase
    AngularFireAuthModule //Novo -- Firebase
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider //Novo -- Provider do Firebase
  ]
})
export class AppModule {}
