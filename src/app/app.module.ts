import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';

import { MyApp } from './app.component';

//Camera
import { Camera } from '@ionic-native/camera'; //https://github.com/apache/cordova-plugin-camera#module_camera.CameraOptions

//Storage
import { IonicStorageModule } from "@ionic/storage";

//Firebase
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireDatabaseModule } from 'angularfire2/database';

//Paginas
import { CadastroPage } from "../pages/cadastro/cadastro";
import { EsqueciSenhaPage } from "../pages/esqueci-senha/esqueci-senha";
import { PerfilPage } from "../pages/perfil/perfil";
import { EquipePage } from "../pages/equipe/equipe";
import { EquipeListaPage } from "../pages/equipe-lista/equipe-lista";
import { EquipeConvidarPage } from "../pages/equipe-convidar/equipe-convidar";
import { ConvitesPage } from "../pages/convites/convites";
import { ChatPage } from "../pages/chat/chat";   
import { LocalPage } from "../pages/local/local";
import { LocalMapaPage } from "../pages/local-mapa/local-mapa";
import { LocaisPage } from "../pages/locais/locais";
import { TarefasPage } from "../pages/tarefas/tarefas";
import { TarefaPage } from "../pages/tarefa/tarefa";

import { firebaseConfig } from "./app.constants";

//Maps
import { Geolocation } from '@ionic-native/geolocation';

//Popover
import { PerfilPopoverPage } from "../pages/perfil-popover/perfil-popover";
import { ContextoPopoverPage } from "../pages/contexto-popover/contexto-popover";

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
  import { ElasticDirective } from "../directives/elastic/elastic";
import { LocalServiceProvider } from '../providers/local-service/local-service';
import { TarefaServiceProvider } from '../providers/tarefa-service/tarefa-service';

import { TabsPage } from '../pages/tabs/tabs';

//Components
import { TagsInputModule } from "../components/tags-input/index";
import { TarefaStatusLabelComponent } from "../components/tarefa-status-label/tarefa-status-label";
// import { SessaoUsuarioServiceProvider } from '../providers/sessao-usuario-service/sessao-usuario-service';

import { EquipeContextoPage } from "../pages/equipe-contexto/equipe-contexto";
import { DatePicker } from '@ionic-native/date-picker';
@NgModule({
  declarations: [
    MyApp,
    TabsPage,
      CadastroPage,
      EsqueciSenhaPage,
      PerfilPage,
      PerfilPopoverPage,
      ContextoPopoverPage,
      PerfilAlterarEmailPage,
      PerfilAlterarSenhaPage,
      EquipePage,
      EquipeListaPage,
      EquipeConvidarPage,
      ConvitesPage,
      ChatPage, ElasticDirective,
      LocalPage,
      LocalMapaPage,
      LocaisPage,
      TarefasPage,
      TarefaPage,
      EquipeContextoPage,
      LocalSelectPage,
      UsuarioSelectPage,

      TarefaStatusLabelComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      //https://forum.ionicframework.com/t/how-to-set-the-whole-app-in-androids-style-even-if-on-ios-in-ionic2/42504/10#post_10
      //http://ionicframework.com/docs/api/config/Config/
      
      tabsPlacement: 'top',
      // platforms: {
      //   android: {
      //     tabsPlacement: 'top'
      //   },
      //   ios: {
      //     tabsPlacement: 'top'
      //   },
      //   windows:
      //   {
      //     tabsPlacement: 'top'
      //   }
      // },
      mode: 'md',
    }),
    IonicStorageModule.forRoot(), //Storage
    AngularFireModule.initializeApp(firebaseConfig), //Novo -- Firebase
    AngularFireAuthModule,
    AngularFireDatabaseModule, //Novo -- Firebase
    
    TagsInputModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
      CadastroPage,
      EsqueciSenhaPage,
      PerfilPage,
      PerfilPopoverPage,
      ContextoPopoverPage,
      PerfilAlterarEmailPage,
      PerfilAlterarSenhaPage,
      EquipePage,
      EquipeListaPage,
      EquipeConvidarPage,
      ConvitesPage,
      ChatPage,
      LocalPage,
      LocalMapaPage,
      LocaisPage,
      TarefasPage,
      TarefaPage,
      EquipeContextoPage,
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
    SessaoServiceProvider,
    // SessaoUsuarioServiceProvider
    DatePicker
  ]
})
export class AppModule {}
