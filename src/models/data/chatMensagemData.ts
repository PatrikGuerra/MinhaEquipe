export class ChatMensagemData {
    public constructor(usuarioRemetenteId: string, conteudo: string) {
      this.keyUsuario = usuarioRemetenteId;
      this.conteudo = conteudo;
      this.timestamp = firebase.database.ServerValue.TIMESTAMP;
    }
  
    keyUsuario: string;
    conteudo: string;
    timestamp?: string | Object;
  }