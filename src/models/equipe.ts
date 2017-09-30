export class Equipe {
	$key: string;
	timestamp: any;

	dataInicio: any;
	dataFim: any;

	nome: string;
	fotoUrl: string;
	keyResponsavel: string;
	membros = {};

	public addMembro(uidUsuario: string) {
		this.membros[uidUsuario] = true;
	}

	public getMembros(): string[] {
		return Object.keys(this.membros);
	}
}