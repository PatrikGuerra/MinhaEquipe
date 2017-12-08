import { Usuario } from "../models/usuario";
import { MensagemTipo } from "../app/app.constants";

export class Mensagem {
    $key: string;
    timestamp: any; //?: string | Object;
        dia: any;

    keyRemetente: string;
        remetente: Usuario;

    conteudo: string;
    tipo: MensagemTipo = MensagemTipo.Mensagem;

    public setRemetente(usuarios: Usuario[]) {
        if (this.tipo == MensagemTipo.Mensagem) {
            console.log("setRemetente")
            for (var index = 0; index < usuarios.length; index++) {
                if (usuarios[index].$key == this.keyRemetente) {
                    this.remetente = usuarios[index];
                    break;
                }
            }
        }
    }
}