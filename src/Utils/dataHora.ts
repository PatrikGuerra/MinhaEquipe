

import { Injectable } from '@angular/core';

@Injectable()
export class DataHora {
	public dataIgualAHoje(timestamp: number) {
		return this.diaSemHoras(timestamp) == new Date().setHours(0, 0, 0, 0);
	}

	public diaSemHoras(timestamp: number) {
		return new Date(timestamp).setHours(0, 0, 0, 0);
	}

	public dataFormatada(date: Date) {
		//dd/mm/yyyy hh:mm
	
		// if (date == null) {
		//   return "Selecione uma data e hora";
		// }
	
		// var date = new Date();
		let year = date.getFullYear();
		let month = (date.getMonth() + 1).toString();
		let formatedMonth = (month.length === 1) ? ("0" + month) : month;
		let day = date.getDate().toString();
		let formatedDay = (day.length === 1) ? ("0" + day) : day;
		let hour = date.getHours().toString();
		let formatedHour = (hour.length === 1) ? ("0" + hour) : hour;
		let minute = date.getMinutes().toString();
		let formatedMinute = (minute.length === 1) ? ("0" + minute) : minute;
		//let second = date.getSeconds().toString();
		//let formatedSecond = (second.length === 1) ? ("0" + second) : second;
	
		return formatedDay + "/" + formatedMonth + "/" + year + " " + formatedHour + ':' + formatedMinute //+ ':' + formatedSecond;
	  }
	// static getInstance() {
	// 	return this;
	// }
}