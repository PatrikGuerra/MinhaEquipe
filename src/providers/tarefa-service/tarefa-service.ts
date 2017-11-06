import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { dataBaseStorage } from "../../app/app.constants";
import { TarefaSituacao } from "../../app/app.constants";

//Models
import { Tarefa } from "../../models/tarefa";

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

    return tarefa;
  }

  public getTarefasPorEquipe(keyEquipe: string) {
    return this.db.list(`${dataBaseStorage.Tarefa}/${keyEquipe}`).map((items) => {
      return items.map((item) => {
        return this.firebaseToTarefa(item);
      });
    })
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

  public save(tarefa: Tarefa) {
    var refPai = this.db.database.ref(`${dataBaseStorage.Tarefa}/${tarefa.keyEquipe}`);

    if (!tarefa.$key) {
      tarefa.$key = refPai.push().key;
      //Envia notificação no chat
    }

    var updates = {};

    refPai.child(tarefa.$key).child('keyResponsaveis').set(tarefa.keyResponsaveis);

    return refPai.child(tarefa.$key).update({
      'keyLocal': tarefa.keyLocal,
      //'keyResponsaveis': tarefa.keyResponsaveis,
      'keyEquipe': tarefa.keyEquipe,
      'nome': tarefa.nome,
      'descricao': tarefa.descricao,
      'situacao': tarefa.situacao,
    });
  }

  public remove(tarefa: Tarefa) {
    tarefa.keyResponsaveis.forEach(keyResponsavel => {
      this.db.database.ref(`${dataBaseStorage.TarefaResponsavel}/${keyResponsavel}/${tarefa.keyEquipe}/${tarefa.$key}`).remove();
    });

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
