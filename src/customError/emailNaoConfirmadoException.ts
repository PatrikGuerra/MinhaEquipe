// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
// https://www.metachris.com/2017/01/custom-errors-in-typescript-2.1/
export class EmailNaoConfirmadoException extends Error {
	constructor(message?: string) {
		super(message); // 'Error' breaks prototype chain here

		Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
	}
}