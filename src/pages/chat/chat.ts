import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform, PopoverController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';

import { ElasticDirective } from "../../directives/elastic/elastic";

import { MensagemTipo } from "../../app/app.constants";

//Providers
import { ChatServiceProvider } from "../../providers/chat-service/chat-service";

//Models
import { Usuario } from "../../models/usuario";
import { Equipe } from "../../models/equipe";
import { Mensagem } from "../../models/mensagem";

//Pages
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";

import { DataHora } from "../../Utils/dataHora";

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage implements OnInit, OnDestroy {
  chatText: string;
  textMaxLength: number = 400;
  usuario: Usuario;
  equipe: Equipe;

  private autoScroller: MutationObserver;

  private mensagens: Array<Mensagem>;
  private enumMensagemTipo = MensagemTipo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public keyboard: Keyboard,
    public chatService: ChatServiceProvider,

    private usuarioService: UsuarioServiceProvider,
    private sessaoService: SessaoServiceProvider,
    public popoverCtrl: PopoverController,
    public dataHora : DataHora) {

    this.usuario = this.usuarioService.getUsuarioAplicacao();
    this.equipe = this.sessaoService.equipe;    
  }

  private outrosUsuarios = [];

  ionViewDidLoad() {
    console.log(this.sessaoService.equipe.membros);
    this.chatService.getMensagens(this.equipe.$key).subscribe((mensagensData: Mensagem[]) => {

      mensagensData.forEach(mensagem => {
        mensagem.setRemetente(this.sessaoService.equipe.membros);
        if (mensagem.tipo == MensagemTipo.Mensagem && !mensagem.remetente) {

          this.buscarUsuario(mensagem.keyRemetente).then((data: Usuario) => {
            mensagem.remetente = data;
          });
          
          console.log(mensagem.remetente);
        }
      });

      console.log(mensagensData);
      this.mensagens = mensagensData;
    });

    if (this.platform.is('cordova')) {
      this.keyboard.onKeyboardShow().subscribe(() => this.scrollDown());
    }
  }

  private buscarUsuario(keyUsuario: string): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(this.outrosUsuarios);

      for (let index = 0; index < this.outrosUsuarios.length; index++) {
        if (this.outrosUsuarios[index] == keyUsuario) {
          resolve(this.outrosUsuarios[index]);
        }
      }

      this.usuarioService.getUsuario(keyUsuario).take(1).subscribe((data: Usuario) => {
        this.outrosUsuarios.push(data);
        resolve(data)
      });
    });
  }

  ngOnInit() {
    this.autoScroller = this.autoScroll();
  }

  ngOnDestroy() {
    this.autoScroller.disconnect();
  }

  public enviarMensagem(event: any) {
    var conteudoChat = this.chatText.trim();

    if (!conteudoChat) {
      return;
    }

    this.chatText = '';
    this.chatText = ' ';
    this.chatText = '';

    this.chatService.enviarMensagem(this.equipe.$key, this.usuario.$key, this.enumMensagemTipo.Mensagem, conteudoChat).then(() => {
      this.scrollDown();
    }, (error) => {
      console.log(error);
    });
  }

  private scrollDown() {
    this.scroller.scrollTop = this.scroller.scrollHeight;
  }

  private autoScroll(): MutationObserver {
    const autoScroller = new MutationObserver(this.scrollDown.bind(this));

    autoScroller.observe(this.messageContent, {
      childList: true,
      subtree: true
    });

    return autoScroller;
  }

  private get messageContent(): Element {
    return document.querySelector('.messages');
  }

  private get scroller(): Element {
    return this.messageContent.querySelector('.scroll-content');
  }

  private retornaNomeOuEmail(usuario: Usuario) {
    if (usuario) {
      if (usuario.nome) {
        return usuario.nome;
      }

      if (usuario.email) {
        return usuario.email;
      }
    }

    return ""
  }
}
