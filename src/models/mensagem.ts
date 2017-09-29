export enum MensagemTipo {
    chat = 0,
    novoMembro = 1,
}

export class Mensagem {
    $key: string;
    timestamp: any;
    
    keyRemetente: string;
    conteudo: string;
    tipo: number;
}