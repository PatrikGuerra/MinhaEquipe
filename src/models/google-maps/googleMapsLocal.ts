export class GoogleMapsLocal {
	constructor(id: string, description: string) {
	  this.description = description;
	  this.id = id;
	}
  
	id: string;
	description: string;
	lat: number;
	lng: number;
  }