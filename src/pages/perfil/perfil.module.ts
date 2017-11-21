import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PerfilPage } from './perfil';

import { TagsInputModule } from "../../components/tags-input/tags-input.module";

@NgModule({
  declarations: [
    PerfilPage,
  ],
  imports: [
    IonicPageModule.forChild(PerfilPage),
    TagsInputModule
  ],
})
export class PerfilPageModule {}
