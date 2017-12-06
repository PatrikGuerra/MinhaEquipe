import { Equipe } from "./equipe";

export class ConviteUsuario {
    $key?: string;
    email: string;          //quando NÃO há usuário cadastrado 
    keyUsuario: string;     //quando há usuário cadastrado
  
    timestamp: number;
    dia: Date;

    keyEquipe: string;	
	    equipe: Equipe;
}