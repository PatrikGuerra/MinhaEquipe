import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import * as firebase from 'firebase/app';
import { dataBaseStorage } from "../../app/app.constants";

//Models
import { Equipe } from "../../models/equipe";
import { Tarefa } from "../../models/tarefa";
import { Usuario } from "../../models/usuario";

//Providers
import { EquipeServiceProvider } from "../equipe-service/equipe-service";
import { UsuarioServiceProvider } from "../usuario-service/usuario-service";
import { LocalServiceProvider } from "../local-service/local-service";
import { TarefaServiceProvider } from "../tarefa-service/tarefa-service";

@Injectable()
export class SessaoServiceProvider {
  public equipe: Equipe = new Equipe();
  public usuario: Usuario = new Usuario();

  constructor(
    private equipeService: EquipeServiceProvider,
    private usuarioService: UsuarioServiceProvider,
    private localService: LocalServiceProvider,
    private tarefaService: TarefaServiceProvider
  ) {
    console.log('Hello SessaoServiceProvider Provider');
  }

  // this.sessaoService.setEquipeKey(equipe.$key).then(data => {
  //   this.equipe = sessaoService.equipe;
  //   loading.dismiss();
  // })
  public setEquipeKey(keyEquipe: string): Promise<any> {

    return new Promise((resolve, reject) => {
      this.equipeService.getEquipe(keyEquipe).subscribe(dataEquipe => {
        this.equipe = dataEquipe;

        console.log("setEquipeKey------------------------------")
        console.log(this.equipe);

        this.sincronizarMembros().then(dataMembros => {
          this.sincronizarLocais().then(dataLocais => {
            this.sincronizarTarefas().then(dataLocais => {
              resolve(this.equipe);
            });
          });
        });
      });
    });
  }

  public setEquipe(equipe: Equipe): Promise<any> {
    return new Promise((resolve, reject) => {
      this.equipe = equipe;

      console.log("setEquipe-------------------------------------------");
      console.log(this.equipe);

      this.sincronizarMembros().then(dataMembros => {
        this.sincronizarLocais().then(dataLocais => {
          this.sincronizarTarefas().then(dataLocais => {
            resolve(this.equipe);
          });
        });
      });
    });
  }

  private sincronizarMembros(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.usuarioService.getUsuariosPorEquipe(this.equipe.$key).subscribe(data => {

        console.log("sincronizarMembros---------------------------------------")
        console.log(data)

        this.equipe.setMembros(data);
        resolve();
      });
    });
  }

  private sincronizarLocais() {
    return new Promise((resolve, reject) => {
      this.localService.getLocaisPorEquipe(this.equipe.$key).subscribe(data => {

        console.log("sincronizarLocais---------------------------------------")
        console.log(data)

        this.equipe.setLocais(data);
        resolve();
      });
    });
  }

  private sincronizarTarefas() {
    return new Promise((resolve, reject) => {
      this.tarefaService.getTarefasPorEquipe(this.equipe.$key).subscribe((data: Tarefa[]) => {

        data.forEach(tarefa => {
          tarefa.setReponsaveis(this.equipe.membros);

          for (var index = 0; index < this.equipe.locais.length; index++) {
            if (this.equipe.locais[index].$key == tarefa.keyLocal) {
              tarefa.local = this.equipe.locais[index];
              break;
            }
          }
        });

        console.log("sincronizarTarefas---------------------------------------")
        console.log(data)

        this.equipe.tarefas = data;
        resolve();
      });
    });
  }
}
