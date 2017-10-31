export const firebaseConfig = {
	apiKey: "AIzaSyDlEO52-eaJInj1sqL6gdraZ1CV5Cvh150",
	authDomain: "minha-equipe.firebaseapp.com",
	databaseURL: "https://minha-equipe.firebaseio.com",
	projectId: "minha-equipe",
	storageBucket: "minha-equipe.appspot.com",
	messagingSenderId: "357623072399"
};

export const dataBaseStorage = {
	Chat: 'chats',
	Equipe: 'equipes',
	Usuario: 'usuarios',
	Convite: 'convites',
	Local: 'locais',
	Tarefa: 'tarefas',
	TarefaResponsavel: 'tarefaResponsaveis',
};

export enum TarefaSituacao	 {
	Pendente = 0,
	Andamento = 1,
	Finalizado = 2,
	
	Cancelada = 3
}
