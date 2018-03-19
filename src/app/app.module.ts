import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { Camera } from '@ionic-native/camera'; //https://github.com/apache/cordova-plugin-camera#module_camera.CameraOptions
import { Geolocation } from '@ionic-native/geolocation';
import { DatePicker } from '@ionic-native/date-picker';
import { ElasticDirective } from "../directives/elastic/elastic"; //Chat

//Storage
import { IonicStorageModule } from "@ionic/storage";

import { firebaseConfig } from "./app.constants";

//Firebase
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';

//Paginas
import { CadastroPage } from "../pages/cadastro/cadastro";
import { EsqueciSenhaPage } from "../pages/esqueci-senha/esqueci-senha";
import { EquipeConvidarPage } from "../pages/equipe-convidar/equipe-convidar";
import { LocalPage } from "../pages/local/local";
import { LocalMapaPage } from "../pages/local-mapa/local-mapa";
import { TarefaPage } from "../pages/tarefa/tarefa";

//Popover
import { PerfilPopoverPage } from "../pages/perfil-popover/perfil-popover";

//Modals
import { PerfilAlterarEmailPage } from "../pages/perfil-alterar-email/perfil-alterar-email";
import { PerfilAlterarSenhaPage } from "../pages/perfil-alterar-senha/perfil-alterar-senha";
import { LocalSelectPage } from "../pages/local-select/local-select";
import { UsuarioSelectPage } from "../pages/usuario-select/usuario-select";

//Providers
import { SessaoServiceProvider } from '../providers/sessao-service/sessao-service';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { UsuarioServiceProvider } from '../providers/usuario-service//usuario-service';
import { EquipeServiceProvider } from "../providers/equipe-service/equipe-service";
import { ConviteServiceProvider } from "../providers/convite-service/convite-service";
import { ChatServiceProvider } from "../providers/chat-service/chat-service";
import { LocalServiceProvider } from '../providers/local-service/local-service';
import { TarefaServiceProvider } from '../providers/tarefa-service/tarefa-service';
import { DataHora } from "../Utils/dataHora";

@NgModule({
  declarations: [
    MyApp,
    CadastroPage,
    EsqueciSenhaPage,
    EquipeConvidarPage,
    LocalPage,
    LocalMapaPage,
    TarefaPage,
    PerfilPopoverPage,
    PerfilAlterarEmailPage,
    PerfilAlterarSenhaPage,
    LocalSelectPage,
    UsuarioSelectPage,

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, { //http://ionicframework.com/docs/api/config/Config/
      tabsHideOnSubPages: true,
      tabsPlacement: 'top',
      mode: 'md',
    }),
    IonicStorageModule.forRoot(), 
    AngularFireModule.initializeApp(firebaseConfig), 
    AngularFireAuthModule,
    AngularFireDatabaseModule, 
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    MyApp,
    CadastroPage,
    EsqueciSenhaPage,
    EquipeConvidarPage,
    LocalPage,
    LocalMapaPage,
    TarefaPage,
    PerfilPopoverPage,
    PerfilAlterarEmailPage,
    PerfilAlterarSenhaPage,
    LocalSelectPage,
    UsuarioSelectPage,
  ],
  providers: [
    StatusBar,
    Keyboard,
    SplashScreen,
    Camera,
    DatePicker,
    Geolocation,
    ElasticDirective,
    DataHora,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SessaoServiceProvider,
    AuthServiceProvider,
    UsuarioServiceProvider,
    EquipeServiceProvider,
    ConviteServiceProvider,
    ChatServiceProvider,
    LocalServiceProvider,
    TarefaServiceProvider,
  ]
})
export class AppModule { }
