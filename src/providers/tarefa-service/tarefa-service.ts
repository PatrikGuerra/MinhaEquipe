import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { dataBaseStorage } from "../../app/app.constants";
import { TarefaSituacao } from "../../app/app.constants";

import { Http, Response, RequestOptions, Headers } from '@angular/http';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

//Models
import { Tarefa } from "../../models/tarefa";
import { UsuarioTarefasEquipe } from "../../models/usuarioTarefasEquipe";

@Injectable()
export class TarefaServiceProvider {
  constructor(
    public db: AngularFireDatabase) {
    console.log('Hello TarefaServiceProvider Provider');
  }

  private firebaseToTarefa(objeto: any) {
    console.log(objeto)
    let tarefa: Tarefa = Object.assign(new Tarefa(), JSON.parse(JSON.stringify(objeto)))
    tarefa.$key = objeto.$key;

    if (objeto['keyResponsaveis']) {
      tarefa.keyResponsaveis = Object.keys(objeto['keyResponsaveis']);
    } else {
      tarefa.keyResponsaveis = [];
    }

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

  public salvar(tarefa: Tarefa, keyEquipe: string): Promise<any> {
    let cadastro = false;
    return new Promise((resolve, reject) => {

      if (!tarefa.$key) {
        tarefa.$key = this.db.database.ref(`${dataBaseStorage.Tarefa}/${keyEquipe}`).push().key;
        cadastro = true;
        //Envia notificação no chat
      }

      let updates = {}

      updates[`${dataBaseStorage.Tarefa}/${keyEquipe}/${tarefa.$key}`] = {
        'keyLocal': tarefa.keyLocal,
        'keyResponsaveis': tarefa.keyResponsaveisToObject(),
        // 'keyEquipe': tarefa.keyEquipe,
        'nome': tarefa.nome,
        'descricao': tarefa.descricao,
        'situacao': tarefa.situacao,
      }

      tarefa.keyResponsaveis.forEach(keyResponsavel => {
        updates[`${dataBaseStorage.TarefaResponsavel}/${keyResponsavel}/${keyEquipe}/${tarefa.$key}`] = true;
      });

      updates[`${dataBaseStorage.LocalTarefas}/${keyEquipe}/${tarefa.keyLocal}/${tarefa.$key}`] = true;

      if (!cadastro) {
        new Promise((resolve, reject) => {
          this.getTarefa(keyEquipe, tarefa.$key).take(1).subscribe((objetoAntigo) => {
            //https://github.com/angular/angularfire2/issues/456#issuecomment-254464619
            // https://github.com/angular/angularfire2/issues/456#issuecomment-241509299

            if (objetoAntigo.keyLocal != tarefa.keyLocal) {
              this.db.database.ref(`${dataBaseStorage.LocalTarefas}/${keyEquipe}/${objetoAntigo.keyLocal}/${tarefa.$key}`).remove()
            }

            var responsaveisRemovidos = objetoAntigo.keyResponsaveis.filter(e => tarefa.keyResponsaveis.indexOf(e) === -1);
            responsaveisRemovidos.forEach(keyResponsavel => {
              this.db.database.ref(`${dataBaseStorage.TarefaResponsavel}/${keyResponsavel}/${keyEquipe}/${tarefa.$key}`).remove();
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

  public remover(tarefa: Tarefa, keyEquipe: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getTarefa(keyEquipe, tarefa.$key).take(1).subscribe((dataTarefa: Tarefa) => {
        this.db.database.ref(`${dataBaseStorage.Tarefa}/${keyEquipe}/${tarefa.$key}`).remove().then(dataRemover => {
          tarefa.keyResponsaveis.forEach(keyResponsavel => {
            this.db.database.ref(`${dataBaseStorage.TarefaResponsavel}/${keyResponsavel}/${keyEquipe}/${tarefa.$key}`).remove();
          });

          this.db.database.ref(`${dataBaseStorage.LocalTarefas}/${keyEquipe}/${tarefa.keyLocal}/${tarefa.$key}`).remove();

          resolve(true);
        }).catch(error => {
          reject(error);
        });
      })
    });
  }

  public alterarStatus(keyEquipe: string, tarefa: Tarefa, eSituacao: TarefaSituacao) {
    var refPai = this.db.database.ref(`${dataBaseStorage.Tarefa}/${keyEquipe}`);

    return refPai.child(tarefa.$key).update({
      'situacao': eSituacao,
    });
  }

  public getUsuarioTarefasEquipe(keyUsuario: string) {
    return this.db.list(`${dataBaseStorage.TarefaResponsavel}/${keyUsuario}`).map((items) => {
      return items.map((item) => {
        let usuarioTarefasEquipe = new UsuarioTarefasEquipe();

        usuarioTarefasEquipe.keyEquipe = item.$key;

        Object.keys(item).forEach(keyTarefa => {
          this.getTarefa(usuarioTarefasEquipe.keyEquipe, keyTarefa).subscribe((dataTarefa: Tarefa) => {
            usuarioTarefasEquipe.tarefas.push(dataTarefa);
          });
        });

        return usuarioTarefasEquipe;
      });
    })
  }
}
