import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';

import { MyApp } from './app.component';

//Camera
import { Camera } from '@ionic-native/camera';
//https://github.com/apache/cordova-plugin-camera#module_camera.CameraOptions

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
import { EquipePage } from "../pages/equipe/equipe";
import { EquipeListaPage } from "../pages/equipe-lista/equipe-lista";
import { EquipeConvidarPage } from "../pages/equipe-convidar/equipe-convidar";
import { EquipeMembrosPage } from "../pages/equipe-membros/equipe-membros";
import { ConvitesPage } from "../pages/convites/convites";
import { ChatPage } from "../pages/chat/chat";
import { LocalPage } from "../pages/local/local";
import { LocalMapaPage } from "../pages/local-mapa/local-mapa";
import { MapsAutoCompletePage } from "../pages/maps-auto-complete/maps-auto-complete";
import { LocaisPage } from "../pages/locais/locais";
import { TarefasPage } from "../pages/tarefas/tarefas";
import { TarefaPage } from "../pages/tarefa/tarefa";

//Maps
import { Geolocation } from '@ionic-native/geolocation';

//popover
import { PerfilPopoverPage } from "../pages/perfil-popover/perfil-popover";

//Modals
import { PerfilAlterarEmailPage } from "../pages/perfil-alterar-email/perfil-alterar-email";
import { PerfilAlterarSenhaPage } from "../pages/perfil-alterar-senha/perfil-alterar-senha";
import { LocalSelectPage } from "../pages/local-select/local-select";
import { UsuarioSelectPage } from "../pages/usuario-select/usuario-select";

//Providers
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { UsuarioServiceProvider } from '../providers/usuario-service//usuario-service';
import { EquipeServiceProvider } from "../providers/equipe-service/equipe-service";
import { ConviteServiceProvider } from "../providers/convite-service/convite-service";
import { ChatServiceProvider } from "../providers/chat-service/chat-service";
import { LocalServiceProvider } from '../providers/local-service/local-service';
import { TarefaServiceProvider } from '../providers/tarefa-service/tarefa-service';

//import { IonTagsInputModule } from "../components/ion-tags-input/index";
import { TagsInputModule } from "../components/tags-input/index";

import { firebaseConfig } from "./app.constants";

import { ElasticDirective } from "../directives/elastic/elastic";
import { SessaoServiceProvider } from '../providers/sessao-service/sessao-service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
      CadastroPage,
      EsqueciSenhaPage,
      LoginPage,
      PerfilPage,
      PerfilPopoverPage,
      PerfilAlterarEmailPage,
      PerfilAlterarSenhaPage,
      EquipePage,
      EquipeListaPage,
      EquipeConvidarPage,
      EquipeMembrosPage,
      ConvitesPage,
      ChatPage, ElasticDirective,
      LocalPage,
      LocaisPage,
      LocalMapaPage,
      MapsAutoCompletePage,
      TarefasPage,
      TarefaPage,
      LocalSelectPage,
      UsuarioSelectPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, 
    {
      mode: 'md' 
      //https://forum.ionicframework.com/t/how-to-set-the-whole-app-in-androids-style-even-if-on-ios-in-ionic2/42504/10#post_10
      //http://ionicframework.com/docs/api/config/Config/
    }),
    IonicStorageModule.forRoot(), //Storage
    AngularFireModule.initializeApp(firebaseConfig), //Novo -- Firebase
    AngularFireAuthModule,
    AngularFireDatabaseModule, //Novo -- Firebase
    
    //IonTagsInputModule,
    TagsInputModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
      CadastroPage,
      EsqueciSenhaPage,
      LoginPage,
      PerfilPage,
      PerfilPopoverPage,
      PerfilAlterarEmailPage,
      PerfilAlterarSenhaPage,
      EquipePage,
      EquipeListaPage,
      EquipeConvidarPage,
      EquipeMembrosPage,
      ConvitesPage,
      ChatPage,
      LocalPage,
      LocaisPage,
      LocalMapaPage,
      MapsAutoCompletePage,
      TarefasPage,
      TarefaPage,
      LocalSelectPage,
      UsuarioSelectPage
  ],
  providers: [
    StatusBar,
    Keyboard,
    SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    UsuarioServiceProvider,
    EquipeServiceProvider,
    ConviteServiceProvider,
    ChatServiceProvider,
    Geolocation,
    LocalServiceProvider,
    TarefaServiceProvider,
    SessaoServiceProvider
  ]
})
export class AppModule {}
