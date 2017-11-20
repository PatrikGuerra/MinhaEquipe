import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EquipeListaPage } from './equipe-lista';

@NgModule({
	declarations: [
		EquipeListaPage,
	],
	imports: [
		IonicPageModule.forChild(EquipeListaPage),
	],
})
export class EquipeListaPageModule { }
