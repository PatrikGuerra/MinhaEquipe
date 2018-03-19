import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database-deprecated';

import * as firebase from 'firebase/app';
import { dataBaseStorage } from "../../app/app.constants";

//Models
import { Mensagem } from "../../models/mensagem";
import { ConviteUsuario } from "../../models/conviteUsuario";
import { MensagemTipo } from "../../app/app.constants";

//Service
import { UsuarioServiceProvider } from "../usuario-service/usuario-service";
import { Usuario } from '../../models/usuario';

@Injectable()
export class ChatServiceProvider {
  // private enumMensagemTipo = MensagemTipo; //https://github.com/angular/angular/issues/2885

  constructor(public db: AngularFireDatabase,
    private usuarioService: UsuarioServiceProvider) {
  }

  private firebaseToMensagem(objeto: any) {
    let mensagem: Mensagem = Object.assign(new Mensagem(), JSON.parse(JSON.stringify(objeto)))
    mensagem.$key = objeto.$key;
    mensagem.dia = new Date(mensagem.timestamp);
    
    console.log("--------------")
    console.log(objeto)
    console.log(mensagem)
    console.log("--------------")
    return mensagem;
  }

  // Este método retorna um objeto do tipo "Mensagem" e então é 
  // criado a propriedade "usuario" que contem o objeto de 
  // usuario buscado
  public getMensagens(keyEquipe: string) {
    return <FirebaseListObservable<Mensagem[]>>this.db.list(`${dataBaseStorage.Chat}/${keyEquipe}`).map((items) => {
      return items.map(item => {
        return this.firebaseToMensagem(item);
      });
    });
  }

  public getUltimaMensagem(keyEquipe: string) {
    return this.db.list(`${dataBaseStorage.Chat}/${keyEquipe}`, {
      query: {
        limitToLast: 1,
        orderByPriority: true
      }
    }).subscribe(data => {
      data.map(messages => messages.reverse().map((item) => {
        return this.firebaseToMensagem(item);
      }));
    });

    // ou

    // return <FirebaseListObservable<Mensagem[]>>this.db.list(`${dataBaseStorage.Chat}/${keyEquipe}`, {
    //   query: {
    //     limitToLast: count,
    //     orderByPriority: true
    //   }
    // }).map((items) => {
    //   return items.map(item => {
    //     return this.firebaseToMensagem(item);
    //   });
    // });
  }

  //https://stackoverflow.com/questions/4114095/how-to-revert-git-repository-to-a-previous-commit#answer-21718540
  public enviarMensagem(keyEquipe: string, keyUsuario: string, mensagemTipo: MensagemTipo, conteudo: string) {
    if (mensagemTipo == MensagemTipo.Notificacao) {
      keyUsuario = keyEquipe;
    }

    return this.enviar(keyEquipe, keyUsuario, mensagemTipo, conteudo);
  }

  private enviar(keyEquipe: string, keyUsuario: string, mensagemTipo: MensagemTipo, conteudo: string) {
    

    return this.db.list(`${dataBaseStorage.Chat}/${keyEquipe}`).push({
      'timestamp': firebase.database.ServerValue.TIMESTAMP,
      'keyRemetente': keyUsuario,
      'conteudo': conteudo,
      'tipo': mensagemTipo
    });
  }

  public enviarMensagemMembroEntrou(keyEquipe: string, keyUsuario: string) {
    this.usuarioService.getUsuario(keyUsuario).take(1).subscribe((dataUsuario: Usuario) => {
      let conteudo = `'${dataUsuario.nome}' entrou`
      this.enviar(keyEquipe, dataUsuario.$key, MensagemTipo.Notificacao, conteudo);
    });
  }

  public enviarMensagemMembroSaiu(keyEquipe: string, keyUsuario: string) {
    this.usuarioService.getUsuario(keyUsuario).take(1).subscribe((dataUsuario: Usuario) => {
      let conteudo = `'${dataUsuario.nome}' saiu`
      this.enviar(keyEquipe, dataUsuario.$key, MensagemTipo.Notificacao, conteudo);
    });
  }
  
  public enviarMensagemMembroRemovido(keyEquipe: string, keyUsuario: string) {
    this.usuarioService.getUsuario(keyUsuario).take(1).subscribe((dataUsuario: Usuario) => {
      let conteudo = `'${dataUsuario.nome}' foi removido`
      this.enviar(keyEquipe, dataUsuario.$key, MensagemTipo.Notificacao, conteudo);
    });
  }
  
}