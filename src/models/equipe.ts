import { Usuario } from "./usuario";
import { Local } from "./local";
import { Tarefa } from "./tarefa";

export class Equipe {
	constructor() {
		this.$key = "";

		// this.timestamp: any;
		// this.dataInicio: any;
		// this.dataFim: any;

		this.nome = "";
		this.fotoUrl = "";	

		this.keyResponsavel = "";
		this.responsavel= new Usuario();

		this.keyMembros = {}; 
		this.membros = new Array<Usuario>();
	}
	$key: string;

	timestamp: any;
	dataInicio: any;
	dataFim: any;
	nome: string;
	fotoUrl: string;	

	keyResponsavel: string;
		responsavel: Usuario;

	keyMembros: {} = {};
		membros: Usuario[];

		locais: Local[] = [];
		tarefas: Tarefa[] = [];

	public addMembro(uidUsuario: string) {
		this.keyMembros[uidUsuario] = true;
	}
	
	public getKeyMembros() {
		return this.keyMembros;
	}
	public setMembros(membros: Usuario[]) {
		this.membros = membros;
		
		for (var index = 0; index < membros.length; index++) {
			if (membros[index].$key == this.keyResponsavel){
				this.responsavel = membros[index];
				break;
			}
		}
	}

	public setLocais(locais: Local[]) {
		this.locais = locais;
	}
}