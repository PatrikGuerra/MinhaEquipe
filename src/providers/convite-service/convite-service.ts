import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import * as firebase from 'firebase';

import { dataBaseStorage } from "../../app/app.constants";

//Services
import { UserServiceProvider } from "../user-service/user-service";
import { EquipeServiceProvider } from "../equipe-service/equipe-service";

//Models
import { Equipe } from "../../models/equipe";
import { Usuario } from "../../models/usuario";
import { ConviteUsuario } from "../../models/conviteUsuario";

//Models Data
import { ConviteEquipeData } from "../../models/data/ConviteEquipeData";

@Injectable()
export class ConviteServiceProvider {
  private listaConvites: FirebaseListObservable<any[]>

  constructor(
    public db: AngularFireDatabase,
    public userProvider: UserServiceProvider,
    public equipeService: EquipeServiceProvider) {

    console.log('Hello ConviteServiceProvider Provider');
  }

  //https://github.com/angular/angularfire2/issues/708

  //ok
  public enviarConvites(listaEmails: string[], equipeId: string) {
    listaEmails = this.tratarListaDeEmails(listaEmails);//ok

    var listaKeyUsuarios = [];
    var listaEmailsNaoCadastrados = [];

    return this.buscarUsuariosPorEmail(listaEmails, listaKeyUsuarios, listaEmailsNaoCadastrados).then(data => {
      return this.equipeService.getEquipe(equipeId).subscribe((equipe: any) => {
        var listaMembrosEquipeKey = Object.keys(equipe.membros)

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
  //ok
  private buscarUsuariosPorEmail(listaEmails: string[], listaKeyUsuarios: any[], listaEmailsNaoCadastrados: string[]) {
    var promises = [];

    listaEmails.forEach(email => {
      var promise = new Promise((resolve, reject) => {
        this.userProvider.getUsuarioByEmail(email).subscribe((data: any) => {
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
  //ok
  private getConvitesEquipe(equipeId: string) {
    return this.db.list(`${dataBaseStorage.Convite}`, {
      query: {
        orderByChild: `keyEquipe`,
        equalTo: equipeId,
      }
    });
  }
  //ok
  private getKeyConvitesExistentes(equipeId: string, listaUsuariosKey: string[], listaEmails: string[]): Promise<any> {
    var keys: string[] = [];

    return new Promise((resolve, reject) => {
      return this.getConvitesEquipe(equipeId).subscribe((data) => {
        data.forEach(convite => {
          if (listaUsuariosKey.indexOf(convite.keyUsuario) > -1 || listaEmails.indexOf(convite.email) > -1) {
            keys.push(convite.$key)
          }
        })

        resolve(keys)
      });
    });
  }
  //ok
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

  public convites(usuarioId: string): FirebaseListObservable<ConviteUsuario[]> {//: Promise<any> {
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

  private excluirConvite(keyConvite: string) {
    var cv = this.db.database.ref(`${dataBaseStorage.Convite}/${keyConvite}`);
    return cv.remove();
  }

  public recusarConvite(convite: any) {
    return this.excluirConvite(convite.$key)
  }

  public aceitarConvite(convite: any) {
    console.log(convite);

    this.userProvider.getUser().then(userObservable => {
      userObservable.subscribe((usuarioData: Usuario) => {

        var equipee: Equipe = convite.equipe

        var updates = {};
        updates[`${dataBaseStorage.Equipe}/${equipee.$key}/membros/${usuarioData.$key}`] = true
        // /equipes
        // /-KvRuD-alrojFi8PkGwW
        // /membros
        // /UGn4OuOO5GTPO7ZeI5xmqyM3yV92

        updates[`${dataBaseStorage.Usuario}/${usuarioData.$key}/equipes/${equipee.$key}`] = true;
        // /usuarios
        // /UGn4OuOO5GTPO7ZeI5xmqyM3yV92
        // /equipes
        // /-KvRuD-alrojFi8PkGwW

        return this.db.database.ref().update(updates).then((data) => {
          this.excluirConvite(convite.$key)
        });

      });
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
