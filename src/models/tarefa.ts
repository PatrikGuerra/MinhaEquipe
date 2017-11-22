

import { TarefaSituacao } from "../app/app.constants";

import { Local } from "./local";
import { Usuario } from "./usuario";
import { Equipe } from "./equipe";

export class Tarefa {
		$key?: string = "";

	keyLocal: string; 
		local: Local;

	keyResponsaveis: string[] = [];
		responsaveis: Usuario[] = [];

	keyEquipe: string;
		equipe: Equipe; //opcional, só usado quando o usuario esta analisando suas tarefas

	nome: string;
	descricao: string;
	situacao: TarefaSituacao = TarefaSituacao.Pendente;

	public setReponsaveis(membrosEquipe: Usuario[]) {
		this.responsaveis = [];

		membrosEquipe.forEach(membro => {
			if (this.keyResponsaveis.indexOf(membro.$key) > -1) {
				this.responsaveis.push(membro);
			}
		});
	}

	public keyResponsaveisToObject() {
		let obj = {};

		this.keyResponsaveis.forEach(element => {
			obj[element] = true;
		});

		return obj;
	}

	public Copy() {
		return Object.assign(new Tarefa(), JSON.parse(JSON.stringify(this)))
	}
}

