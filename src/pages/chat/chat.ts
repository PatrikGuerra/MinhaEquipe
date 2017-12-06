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
    public popoverCtrl: PopoverController) {

    this.usuario = this.usuarioService.usuario;
    this.equipe = this.sessaoService.equipe;
  }

  ionViewDidLoad() {
    this.chatService.getMensagens(this.equipe.$key).subscribe((mensagensData) => {
      this.mensagens = mensagensData;
    });

    if (this.platform.is('cordova')) {
      this.keyboard.onKeyboardShow().subscribe(() => this.scrollDown());
    }
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

  isToday(timestamp: number) {
    return this.diaSemHora(timestamp) == new Date().setHours(0, 0, 0, 0);
  }

  public diaSemHora(timestamp: number) {
    return new Date(timestamp).setHours(0, 0, 0, 0);
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
}
