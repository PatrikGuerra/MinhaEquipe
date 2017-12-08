import { Coordenadas } from "./coordenadas";

export class Local {
	$key:string;

	nome: string = "";
	descricao: string = "";
	coordenadas: Coordenadas = null;;
	keyTarefas: string[] = [];

	public Copy() {
		return Object.assign(new Local(), JSON.parse(JSON.stringify(this)))
	}
}