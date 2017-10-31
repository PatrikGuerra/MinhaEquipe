import { TarefaSituacao } from "../../app/app.constants";





export class TarefaData {


	keyLocal: string;

	
	keyResponsaveis: string[] = [];


	nome: string;
	descricao: string;
	situacao: TarefaSituacao;
}
