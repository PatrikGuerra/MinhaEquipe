import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PerfilPage } from './perfil';

// import { TarefaStatusLabelComponent } from "../../components/tarefa-status-label/tarefa-status-label";
@NgModule({
  declarations: [
    PerfilPage,
    //TarefaStatusLabelComponent
  ],
  imports: [
    IonicPageModule.forChild(PerfilPage),
    
  ],
})
export class PerfilPageModule {}
