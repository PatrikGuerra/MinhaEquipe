/*
https://humaan.com/blog/custom-html-markers-google-maps/
https://www.djamware.com/post/58d4ce1c80aca76428d002b8/integrating-ionic-2-google-maps-and-geolocation-using-ionic-native
https://stackoverflow.com/questions/43883343/add-custom-marker-with-store-logo-in-ionic-using-google-map
https://stackoverflow.com/questions/42598133/ionic-2-dynamic-markers-in-google-maps-with-profile-picture/42600327#42600327
https://medium.com/the-web-tub/creating-google-maps-sample-app-with-angularjs-and-onsen-ui-c1325139781e
https://stackoverflow.com/questions/24413766/how-to-use-svg-markers-in-google-maps-api-v3
*/
export class LocalMarker extends google.maps.OverlayView {
	marker: any;
	clickListener: google.maps.MapsEventListener;

	constructor(private latlng, map, private args) {
		super();
		this.setMap(map);
	}

	draw() {
		const panes = this.getPanes();
		let marcador = this.marker;

		if (!marcador) {
			marcador = this.marker = document.createElement('div');
			marcador.className = 'markerLocal';

			// if (this.args.img) {
			// 	let imagem = document.createElement('img');
			// 	imagem.src = this.args.img;
			// 	marcador.appendChild(imagem);
			// } else {
			// 	let paragrafo = document.createElement('p');
			// 	paragrafo.innerHTML = this.args.label.substring(0, 2);
			// 	marcador.appendChild(paragrafo);
			// }

			// let point = this.getProjection().fromLatLngToDivPixel(this.latlng);
			// if (point) {
			// 	marker.style.left = (point.x - 35) + 'px';
			// 	marker.style.top = (point.y - 35) + 'px';
			// }

			this.clickListener = google.maps.event.addDomListener(marcador, "click", (event) => {
				// alert('You clicked on a custom marker!');
				console.log('You clicked on a custom marker! local');
				console.log(event)
				google.maps.event.trigger(this, "click");
			});

			var paneses = this.getPanes();
			paneses.overlayMouseTarget.appendChild(marcador);
		}

		var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

		//var clientHeight = document.getElementById('myDiv').clientHeight;
		//https:/ / stackoverflow.com / questions / 15615552 / get - div - height -with-plain - javascript
		if (point) {
			marcador.style.left = (point.x - (45 / 2)) + 'px';
			marcador.style.top = (point.y - ((45 + 16 - 5))) + 'px';
		}
	}

	remove() {
		if (this.marker) {
			this.marker.parentNode.removeChild(this.marker);
			this.clickListener.remove();
			this.marker = null;
		}
	}

	getPosition() {
		return this.latlng;
	}
}
