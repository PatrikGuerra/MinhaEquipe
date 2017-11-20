import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { dataBaseStorage } from "../../app/app.constants";
import { TarefaSituacao } from "../../app/app.constants";

//Models
import { Tarefa } from "../../models/tarefa";

// import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
// import { Router } from '@angular/router';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
// import { Events } from './Events';

@Injectable()
export class TarefaServiceProvider {
  private enumTarefaSituacao = TarefaSituacao;

  constructor(
    public db: AngularFireDatabase) {
    console.log('Hello TarefaServiceProvider Provider');
  }

  private firebaseToTarefa(objeto: any) {
    let tarefa: Tarefa = Object.assign(new Tarefa(), JSON.parse(JSON.stringify(objeto)))
    tarefa.$key = objeto.$key;
    tarefa.keyResponsaveis = Object.keys(objeto['keyResponsaveis']);

    console.log(tarefa)

    return tarefa;
  }

  public getTarefasPorEquipe(keyEquipe: string) {
    return this.db.list(`${dataBaseStorage.Tarefa}/${keyEquipe}`).map((items) => {
      return items.map((item) => {
        return this.firebaseToTarefa(item);
      });
    })

  }

  public getTarefa(keyEquipe: string, keyTarefa: string) {
    return this.db.object(`${dataBaseStorage.Tarefa}/${keyEquipe}/${keyTarefa}`).map((item) => {
      return this.firebaseToTarefa(item);
    });
  }

  public getTarefasPorLocalId(keyEquipe: string, keyLocal: string): Promise<any> {
    return new Promise((resolve, reject) => {

      this.db.list(`${dataBaseStorage.Tarefa}/${keyEquipe}`, {
        query: {
          orderByChild: `keyLocal`,
          equalTo: keyLocal,
          limitToFirst: 2
        }
      }).map((items) => {
        var quantidade = 0;

        items.map((item) => {
          quantidade++;
        });

        resolve(quantidade);
      })
    });
  }


  public save(tarefa: Tarefa): Promise<any> {
    let cadastro = false;
    return new Promise((resolve, reject) => {

      if (!tarefa.$key) {
        tarefa.$key = this.db.database.ref(`${dataBaseStorage.Tarefa}/${tarefa.keyEquipe}`).push().key;
        cadastro = true;
        //Envia notificação no chat
      }

      let updates = {}

      updates[`${dataBaseStorage.Tarefa}/${tarefa.keyEquipe}/${tarefa.$key}`] = {
        'keyLocal': tarefa.keyLocal,
        'keyResponsaveis': tarefa.keyResponsaveisToObject(),
        'keyEquipe': tarefa.keyEquipe,
        'nome': tarefa.nome,
        'descricao': tarefa.descricao,
        'situacao': tarefa.situacao,
      }

      tarefa.keyResponsaveis.forEach(keyResponsavel => {
        updates[`${dataBaseStorage.TarefaResponsavel}/${keyResponsavel}/${tarefa.keyEquipe}/${tarefa.$key}`] = true;
      });

      updates[`${dataBaseStorage.LocalTarefas}/${tarefa.keyEquipe}/${tarefa.keyLocal}/${tarefa.$key}`] = true;

      if (!cadastro) {
        new Promise((resolve, reject) => {
          this.getTarefa(tarefa.keyEquipe, tarefa.$key).take(1).subscribe((objetoAntigo) => {
            if (objetoAntigo.keyLocal != tarefa.keyLocal) {
              this.db.database.ref(`${dataBaseStorage.LocalTarefas}/${tarefa.keyEquipe}/${objetoAntigo.keyLocal}/${tarefa.$key}`).remove()
            }

            var responsaveisRemovidos = objetoAntigo.keyResponsaveis.filter(e => tarefa.keyResponsaveis.indexOf(e) === -1);
            responsaveisRemovidos.forEach(keyResponsavel => {
              this.db.database.ref(`${dataBaseStorage.TarefaResponsavel}/${keyResponsavel}/${tarefa.keyEquipe}/${tarefa.$key}`).remove();
            });

            resolve(true);
          });
        }).then(data => {
          resolve(this.db.database.ref().update(updates))
        })

      } else {
        resolve(this.db.database.ref().update(updates))
      }
    });
  }

  public remove(tarefa: Tarefa) {
    // tarefa.keyResponsaveis.forEach(keyResponsavel => {
    //   this.db.database.ref(`${dataBaseStorage.TarefaResponsavel}/${keyResponsavel}/${tarefa.keyEquipe}/${tarefa.$key}`).remove();
    // });

    return this.db.database.ref(`${dataBaseStorage.Tarefa}/${tarefa.keyEquipe}/${tarefa.$key}`).remove();
  }

  public alterarStatus(tarefa: Tarefa, eSituacao: TarefaSituacao) {
    var refPai = this.db.database.ref(`${dataBaseStorage.Tarefa}/${tarefa.keyEquipe}`);

    return refPai.child(tarefa.$key).update({
      'situacao': eSituacao,
    });
  }

  // public getTarefasUsuario(keyEquipe: string): FirebaseListObservable<ConviteUsuario[]> {
  //   return <FirebaseListObservable<Tarefa[]>>this.db.list(`${dataBaseStorage.Tarefa}/${keyEquipe}`, {
  //     query: {
  //       orderByChild: `keyUsuario`,
  //       equalTo: usuarioId
  //     }
  //   }).map((items) => {
  //     return items.map(item => {
  //       this.equipeService.getEquipe(item.keyEquipe).subscribe(data => {
  //         item.equipe = data
  //       })

  //       return item;
  //     });
  //   })
  // }


}
