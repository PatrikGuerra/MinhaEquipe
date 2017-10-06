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
import { ConvitesPage } from "../pages/convites/convites";
import { ChatMessagePage } from "../pages/chat-message/chat-message";

//popover
import { PerfilPopoverPage } from "../pages/perfil-popover/perfil-popover";

//Modals
import { PerfilAlterarEmailPage } from "../pages/perfil-alterar-email/perfil-alterar-email";
import { PerfilAlterarSenhaPage } from "../pages/perfil-alterar-senha/perfil-alterar-senha";

//Providers
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { UserServiceProvider } from "../providers/user-service/user-service";
import { EquipeServiceProvider } from "../providers/equipe-service/equipe-service";
import { ConviteServiceProvider } from "../providers/convite-service/convite-service";
import { ChatServiceProvider } from "../providers/chat-service/chats-service";

import { UsuarioServiceProvider } from '../providers/usuario-service//usuario-service';

//import { IonTagsInputModule } from "../components/ion-tags-input/index";
import { TagsInputModule } from "../components/tags-input/index";

import { firebaseConfig } from "./app.constants";

import { ElasticDirective } from "../directives/elastic/elastic";

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
      ConvitesPage,
      ChatMessagePage,
      ElasticDirective
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
      ConvitesPage,
      ChatMessagePage
  ],
  providers: [
    StatusBar,
    Keyboard,
    SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    UserServiceProvider,
    EquipeServiceProvider,
    UsuarioServiceProvider,
    ConviteServiceProvider,
    ChatServiceProvider
  ]
})
export class AppModule {}
