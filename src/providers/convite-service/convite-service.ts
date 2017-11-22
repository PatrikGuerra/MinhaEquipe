import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { dataBaseStorage } from "../../app/app.constants";

//Services
import { UsuarioServiceProvider } from "../usuario-service/usuario-service";
import { EquipeServiceProvider } from "../equipe-service/equipe-service";

//Models
import { Equipe } from "../../models/equipe";
import { Usuario } from "../../models/usuario";
import { ConviteUsuario } from "../../models/conviteUsuario";

//Models Data
import { ConviteEquipeData } from "../../models/data/ConviteEquipeData";

@Injectable()
export class ConviteServiceProvider {

  constructor(
    public db: AngularFireDatabase,
    public userService: UsuarioServiceProvider,
    public equipeService: EquipeServiceProvider) {

    console.log('Hello ConviteServiceProvider Provider');
  }

  //https://github.com/angular/angularfire2/issues/708

  public enviarConvites(listaEmails: string[], equipeId: string) {
    listaEmails = this.tratarListaDeEmails(listaEmails);

    var listaKeyUsuarios = [];
    var listaEmailsNaoCadastrados = [];

    return this.buscarUsuariosPorEmail(listaEmails, listaKeyUsuarios, listaEmailsNaoCadastrados).then(data => {
      return this.equipeService.getEquipe(equipeId).take(1).subscribe((equipe: Equipe) => {
        var listaMembrosEquipeKey = Object.keys(equipe.keyMembros);

        listaKeyUsuarios = this.RetornaItensDeAqueNaoExistemEmB(listaKeyUsuarios, listaMembrosEquipeKey);

        return this.removerConvitesExistentes(equipeId, listaKeyUsuarios, listaEmailsNaoCadastrados).then(dataRemover => {
          var updates = {};

          listaKeyUsuarios.forEach(elemUsuarioKey => {
            var convite = new ConviteEquipeData(equipeId, elemUsuarioKey, "");
            var keyConvite = this.db.database.ref(`${dataBaseStorage.Convite}`).push().key;

            updates[`${dataBaseStorage.Convite}/${keyConvite}`] = convite;
          });

          listaEmailsNaoCadastrados.forEach(elemEmail => {
            var convite = new ConviteEquipeData(equipeId, "", elemEmail);
            var keyConvite = this.db.database.ref(`${dataBaseStorage.Convite}`).push().key;

            updates[`${dataBaseStorage.Convite}/${keyConvite}`] = convite;
          });

          return this.db.database.ref().update(updates);
        });
      });
    });
  }

  private buscarUsuariosPorEmail(listaEmails: string[], listaKeyUsuarios: any[], listaEmailsNaoCadastrados: string[]) {
    var promises = [];

    listaEmails.forEach(email => {
      var promise = new Promise((resolve, reject) => {
        this.userService.getUsuarioByEmail(email).take(1).subscribe((data: any) => {
          if (data.length > 0) {
            listaKeyUsuarios.push(<Usuario>data[0].$key);
          } else {
            listaEmailsNaoCadastrados.push(email);
          }

          resolve(data);
        }, (error: any) => {
          reject(error);
        });
      });

      promises.push(promise);
    });

    return Promise.all(promises);
  }

  private getConvitesEquipe(equipeId: string) {
    return this.db.list(`${dataBaseStorage.Convite}`, {
      query: {
        orderByChild: `keyEquipe`,
        equalTo: equipeId,
      }
    });
  }

  private getKeyConvitesExistentes(equipeId: string, listaUsuariosKey: string[], listaEmails: string[]): Promise<any> {
    var keys: string[] = [];

    return new Promise((resolve, reject) => {
      return this.getConvitesEquipe(equipeId).take(1).subscribe((data) => {
        data.forEach(convite => {
          if (listaUsuariosKey.indexOf(convite.keyUsuario) > -1 || listaEmails.indexOf(convite.email) > -1) {
            keys.push(convite.$key)
          }
        })

        resolve(keys)
      });
    });
  }

  private removerConvitesExistentes(equipeId: string, listaUsuariosKey: string[], listaEmails: string[]) {
    var promises = [];

    return this.getKeyConvitesExistentes(equipeId, listaUsuariosKey, listaEmails).then(data => {
      data.forEach(key => {
        var promise = new Promise((resolve, reject) => {
          this.db.object(`${dataBaseStorage.Convite}/${key}`).remove().then(a => resolve())
        });

        promises.push(promise);
      });

      return Promise.all(promises);
    })
  }

  public meusConvites(usuarioId: string): FirebaseListObservable<ConviteUsuario[]> {
    return <FirebaseListObservable<ConviteUsuario[]>>this.db.list(`${dataBaseStorage.Convite}`, {
      query: {
        orderByChild: `keyUsuario`,
        equalTo: usuarioId
      }
    }).map((items) => {
      return items.map(item => {
        this.equipeService.getEquipe(item.keyEquipe).subscribe(data => {
          item.equipe = data
        })

        return item;
      });
    })
  }

  private excluirConvite(conviteId: string) {
    return this.db.object(`${dataBaseStorage.Convite}/${conviteId}`).remove().then(data => {
      return data;
    });
  }

  public recusarConvite(convite: ConviteUsuario) {
    return this.excluirConvite(convite.$key).then(data => {
      return data;
    });
  }

  public aceitarConvite(convite: ConviteUsuario) {
    var updates = {};
    updates[`${dataBaseStorage.Equipe}/${convite.keyEquipe}/membros/${convite.keyUsuario}`] = true
    // /equipes
    // /-KvRuD-alrojFi8PkGwW
    // /membros
    // /UGn4OuOO5GTPO7ZeI5xmqyM3yV92

    updates[`${dataBaseStorage.Usuario}/${convite.keyUsuario}/equipes/${convite.keyEquipe}`] = true;
    // /usuarios
    // /UGn4OuOO5GTPO7ZeI5xmqyM3yV92
    // /equipes
    // /-KvRuD-alrojFi8PkGwW

    return this.db.database.ref().update(updates).then((data) => {
      return this.excluirConvite(convite.$key).then(excluirConviteData => {
        return excluirConviteData;
      });
    });
  }

  private convitesDataPorEmail(email: string): FirebaseListObservable<ConviteEquipeData[]> {
    return <FirebaseListObservable<ConviteUsuario[]>>this.db.list(`${dataBaseStorage.Convite}`, {
      query: {
        orderByChild: `email`,
        equalTo: email
      }
    });
  }

  public atualizarKeyUsuarioDosConvites(email: string, usuarioId: string) {
    return new Promise((resolve, reject) => {

      this.convitesDataPorEmail(email).subscribe((convites) => {
        var updates = {};

        convites.forEach(convite => {
          convite.email = '';
          convite.keyUsuario = usuarioId;

          updates[`${dataBaseStorage.Convite}/${convite.$key}`] = convite;
        })

        this.db.database.ref().update(updates).then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      })

    });
  }

  //Auxiliares
  private RetornaItensDeAqueNaoExistemEmB(a, b) {
    //Retorna um novo array contendo os itens de A que não existem no array B
    var result = [];

    for (var i = 0; i < a.length; i++) {
      if (b.indexOf(a[i]) === -1) {
        result.push(a[i]);
      }
    }

    return result;
  }
  private RemoveItensDeAqueExistemEmB(a, b) {
    //Remove os itens do array A que existem no array B
    for (var i = 0; i < b.length; i++) {
      for (var j = 0; j < a.length; j++) {
        if (b[i] == a[j]) {
          a.splice(j, 1);
          break;
        }
      }
    }
  }
  private tratarListaDeEmails(emails: string[]) {
    var listaEmail: string[] = [];

    emails.forEach(element => {
      listaEmail.push(this.trim(element));
    });

    listaEmail = this.uniqueValue(listaEmail);

    return listaEmail;
  }
  private trim(str) {
    return str.replace(/^\s+|\s+$/g, "");
  }
  private uniqueValue(myArray: any) {
    return myArray.filter(function (item, pos, self) {
      return self.indexOf(item) == pos;
    })
  }
}
