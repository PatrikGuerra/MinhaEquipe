import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import * as firebase from 'firebase';

//Services
import { UserServiceProvider } from "../user-service/user-service";
import { EquipeServiceProvider } from "../equipe-service/equipe-service";

//Models
import { Equipe } from "../../models/equipe";
import { EquipeConvite } from "../../models/equipeConvite";
import { Usuario } from "../../models/usuario";

import { dataBaseStorage } from "../../app/app.constants";

@Injectable()
export class ConviteServiceProvider {
  private listaConvites: FirebaseListObservable<any[]>

  constructor(
    public db: AngularFireDatabase,
    public userProvider: UserServiceProvider,
    public equipeService: EquipeServiceProvider) {


    // this.userProvider.getUser().then(userObservable => {
    //   userObservable.subscribe((usuarioData: Usuario) => {
    //     // loading.dismiss();

    //     console.log(usuarioData)

    //     // this.listaConvites = this.db.list(`${dataBaseStorage.Convite}`, {
    //     //   query: {
    //     //     orderByChild: `email`,
    //     //     //equalTo: usuarioData.email
    //     //   }
    //     // })


    //     // return this.db.list(`${dataBaseStorage.Convite}`).subscribe(data => {
    //     //   console.log(data);
    //     // })


    //     // this.usuario = usuarioData;

    //     // if (!this.usuario.tags) {
    //     //   this.usuario.tags = [];
    //     // }
    //   });
    // });

    // this.listaConvites.subscribe(data => {
    //   console.log(data);
    // })

    console.log('Hello ConviteServiceProvider Provider');
  }

  public enviarConvites(convite: EquipeConvite) {
    console.log(convite)

    //https://github.com/angular/angularfire2/issues/708
    var updates = {};
    var keyConvite: string = "";

    for (var index = 0; index < convite.emails.length; index++) {
      keyConvite = this.db.database.ref(`${dataBaseStorage.Convite}`).push().key;

      updates[`${dataBaseStorage.Convite}/${keyConvite}`] = {
        'email': convite.emails[index],
        'keyEquipe': convite.equipe.$key
      }
    }

    return this.db.database.ref().update(updates);
  }

  public convites(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userProvider.getUser().then(userObservable => {
        userObservable.subscribe((usuarioData: Usuario) => {

          this.db.list(`${dataBaseStorage.Convite}`, {
            query: {
              orderByChild: `email`,
              equalTo: usuarioData.email
            }
          }).map((items) => {
            return items.map(item => {
              this.equipeService.getEquipe(item.keyEquipe).subscribe(dataEquipe => {
                item.equipe = dataEquipe;
              })

              return item;
            });
          }).subscribe(x => {
            console.log(x)
            resolve(x)
          });

        });
      });
    });


    // //https://github.com/angular/angularfire2/issues/708
    // return this.userProvider.getUser().then(userObservable => {
    //  return userObservable.subscribe((usuarioData: Usuario) => {
    //     console.log(usuarioData)
    //    /* return this.db.list(`${dataBaseStorage.Convite}`, {
    //       query: {
    //         orderByChild: `email`,
    //         equalTo: usuarioData.email
    //         // orderByKey: true,
    //       }
    //     });*/

    //     return this.db.list(`${dataBaseStorage.Convite}`, {
    //       query: {
    //         orderByChild: `email`,
    //         //equalTo: usuarioData.email
    //       }
    //     });

    //     /*.map((items) => {
    //       return items.map(item => {
    //         item.equipe = this.db.object(`${dataBaseStorage.Equipe}/${item.keyEquipe}`);
    //         return item;
    //       });
    //     });*/

    //   });
    // });





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
    //equipeService.
  }
}
