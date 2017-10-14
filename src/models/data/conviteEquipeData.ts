import * as firebase from 'firebase/app';

export class ConviteEquipeData {
    email?: string; //Quando o emial é de um usuário nao cadastrado
    keyUsuario?: string; //quando á um usuário cadastrado
    timestamp?: string | Object;
    keyEquipe: string;

    constructor(equipeId: string, usuarioId: string, usuarioEmail: string) {
        if (usuarioId) {
            this.keyUsuario = usuarioId;
            this.email = '';
        } else {
            this.keyUsuario = '';
            this.email = usuarioEmail;
        }

        this.keyEquipe = equipeId;
        this.timestamp = firebase.database.ServerValue.TIMESTAMP;
    }
}
//convites/key/