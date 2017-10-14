import { Equipe } from "./equipe";

export class ConviteUsuario {
    $key?: string;
    keyUsuario: string; //quando á um usuário cadastrado
    timestamp?: string | Object;
    keyEquipe: string;	
	equipe: Equipe;
}