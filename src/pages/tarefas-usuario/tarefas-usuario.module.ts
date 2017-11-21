import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TarefasUsuarioPage } from './tarefas-usuario';

@NgModule({
  declarations: [
    TarefasUsuarioPage,
  ],
  imports: [
    IonicPageModule.forChild(TarefasUsuarioPage),
  ],
})
export class TarefasUsuarioPageModule {}
