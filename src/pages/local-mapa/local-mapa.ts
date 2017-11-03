// https://ionicthemes.com/tutorials/about/ionic-2-google-maps-google-places-geolocation
// https://github.com/ionicthemes/ionic-2-google-maps-google-places-geolocation

import { Component, NgZone, ElementRef, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { LoadingController, NavController, NavParams, ViewController } from 'ionic-angular';

import { } from '@types/googlemaps';

//Models
import { Coordenadas } from "../../models/coordenadas";

@Component({
  selector: 'page-local-mapa',
  templateUrl: 'local-mapa.html',
})
export class LocalMapaPage {
  @ViewChild('map') mapElement: ElementRef;
  private map: google.maps.Map;
  private marker: google.maps.Marker;
  autocomplete: any;
  private mapsAutocompleteService = new google.maps.places.AutocompleteService();
  private mapsGeocoder = new google.maps.Geocoder;
  private autocompleteItems = [];

  constructor(
    public zone: NgZone,
    public geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {

    this.autocomplete = {
      input: ''
    };
  }

  private setMarker(latLng: google.maps.LatLng) {
    let newMarker = new google.maps.Marker({
      position: latLng,
      map: this.map
    });

    this.marker = newMarker;
  }

  ionViewDidEnter() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: {
        lat: 0,
        lng: 0
      },
      zoom: 15, //https://developers.google.com/maps/documentation/static-maps/intro#Zoomlevels
      disableDefaultUI: true //https://developers.google.com/maps/documentation/javascript/examples/control-disableUI?hl=pt-br
    });

    if (this.navParams.get('coordenadas')) {
      let coordenadas = this.navParams.get('coordenadas');
      let loadedMarket = new google.maps.LatLng(coordenadas.lat, coordenadas.lng);

      this.setMarker(loadedMarket);
      this.map.setCenter(loadedMarket);
    } else {
      this.centerMapOnCurrentPosition();
    }

    this.map.addListener('click', (e => {
      this.clearMarkers();
      this.setMarker(e.latLng);
    }));
  }

  centerMapOnCurrentPosition() {
    let loadingGeo = this.loadingCtrl.create({
      content: "Buscando sua localização.."
    });

    loadingGeo.present();

    this.currentPosition().then(data => {
      this.map.setCenter(data);
      loadingGeo.dismiss();
    }).catch(error => {
      loadingGeo.dismiss();
    })
  }

  private currentPosition(): Promise<google.maps.LatLng> {
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then((resp) => {
        let pos = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

        resolve(pos);
      }).catch((error) => {
        console.log('Error getting location', error);
        reject(error);
      });
    });
  }

  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }

    this.mapsAutocompleteService.getPlacePredictions({
      input: this.autocomplete.input
    },
      (predictions, status) => {
        this.autocompleteItems = [];
        if (predictions) {
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
      });
  }

  selectSearchResult(item) {
    this.clearMarkers();
    this.autocompleteItems = [];

    this.mapsGeocoder.geocode({
      'placeId': item.place_id
    }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK && results[0]) {
        let novoMarcador = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map
        });

        this.marker = novoMarcador;
        this.map.setCenter(results[0].geometry.location);
      }
    })
  }

  clearMarkers() {
    if (this.marker) {
      this.marker.setMap(null);
    }
  }

  cancelar() {
    this.viewCtrl.dismiss();
  }

  confirmar() {
    var coordenada: Coordenadas = new Coordenadas(this.marker.getPosition().lat(), this.marker.getPosition().lng());

    this.viewCtrl.dismiss({
      coordenada: coordenada
    });
  }
}
