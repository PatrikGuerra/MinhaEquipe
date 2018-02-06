export class DataHora {
	static doSomething(val: string) { return val; }
	static doSomethingElse(val: string) { return val; }

	static isToday(timestamp: number) {
		return this.diaSemHora(timestamp) == new Date().setHours(0, 0, 0, 0);
	}
	
	static diaSemHora(timestamp: number) {
		return new Date(timestamp).setHours(0, 0, 0, 0);
	}
	static getInstance() {
		return this;
	}
}