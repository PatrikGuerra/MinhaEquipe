import { Injectable } from '@angular/core';
// import * as firebase from 'firebase/app';

//Models
import { Equipe } from "../../models/equipe";
import { Usuario } from "../../models/usuario";
import { Local } from '../../models/local';
import { Tarefa } from "../../models/tarefa";

//Providers
import { EquipeServiceProvider } from "../equipe-service/equipe-service";
import { UsuarioServiceProvider } from "../usuario-service/usuario-service";
import { LocalServiceProvider } from "../local-service/local-service";
import { TarefaServiceProvider } from "../tarefa-service/tarefa-service";

@Injectable()
export class SessaoServiceProvider {
  public equipe: Equipe = new Equipe();

  constructor(
    private equipeService: EquipeServiceProvider,
    private usuarioService: UsuarioServiceProvider,
    private localService: LocalServiceProvider,
    private tarefaService: TarefaServiceProvider) {
    console.log('Hello SessaoServiceProvider Provider');
  }

  public getEquipeCompleta(keyEquipe: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let equipezona: Equipe;

      this.equipeService.getEquipe(keyEquipe).subscribe((dataEquipe: Equipe) => {
        console.log("dataEquipe")
        console.log(dataEquipe)
        equipezona = dataEquipe;

        this.usuarioService.getUsuariosPorEquipe(equipezona.$key).subscribe((dataUsuarios: Usuario[]) => {
          console.log("dataUsuarios");
          console.log(dataUsuarios);
          equipezona.setMembros(dataUsuarios);

          this.localService.getLocaisPorEquipe(equipezona.$key).subscribe((dataLocais: Local[]) => {
            console.log("dataLocais")
            console.log(dataLocais)
            equipezona.setLocais(dataLocais);

            this.tarefaService.getTarefasPorEquipe(equipezona.$key).subscribe((dataTarefas: Tarefa[]) => {
              console.log("dataTarefas")
              console.log(dataTarefas)
              dataTarefas.sort(this.dynamicSort('situacao'));

              dataTarefas.forEach(tarefa => {
                tarefa.setReponsaveis(equipezona.membros);
                // this.encontraLocalDaTarefa(tarefa, equipezona.locais);
                
                for (var index = 0; index < equipezona.locais.length; index++) {
                  if (equipezona.locais[index].$key == tarefa.keyLocal) {
                    tarefa.local = equipezona.locais[index];
                    break;
                  }
                }
              });

              equipezona.tarefas = dataTarefas;
              resolve(equipezona);
            });
          });
        });
      });
    });
  }

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

        data.sort(this.dynamicSort('situacao'))

        data.forEach(tarefa => {
          tarefa.setReponsaveis(this.equipe.membros);
          // this.encontraLocalDaTarefa(tarefa, this.equipe.locais);

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

  //Métodos Auxiliares
  private encontraLocalDaTarefa(tarefa: Tarefa, locais: Local[]) {
    if (tarefa.keyLocal) {
      locais.forEach(local => {
        if (tarefa.keyLocal == local.$key) {
          tarefa.local = local;
          return;
        }
      });

      // for (var index = 0; index < locais.length; index++) {
      //   if (locais[index].$key == tarefa.keyLocal) {
      //     tarefa.local = locais[index];
      //     break;
      //   }
      // }
    }
  }

  private sort(a, b) {
    if (a.situacao < b.situacao) {
      return -1;
    }

    if (a.situacao > b.situacao) {
      return 1;
    }

    return 0;
  }

  private dynamicSort(property) {
    // var data = [];
    // data = arrayOfSomething(...);
    // data.sort(this.dynamicSort('property')); //crescente
    // data.sort(this.dynamicSort('-property')); //Decrescente

    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }
}
