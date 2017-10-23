import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';

//Models
import { GoogleMapsLocal } from "../../models/google-maps/googleMapsLocal";

@Component({
  selector: 'page-maps-auto-complete',
  templateUrl: 'maps-auto-complete.html',
})
export class MapsAutoCompletePage {
  private locaisEncontrados: GoogleMapsLocal[];
  private autocomplete: string;

  private service = new google.maps.places.AutocompleteService();
  private geocoder = new google.maps.Geocoder();

  private loadingSituation = {
    cancelado: 0,
    carregando: 1,
  };
  private statusLoading: number = this.loadingSituation.cancelado;

  constructor(
    public viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private zone: NgZone) {

    this.locaisEncontrados = [];
    this.autocomplete = "";
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(local: GoogleMapsLocal) {
    let loading = this.loadingCtrl.create();

    loading.present();

    this.geocodePlaceId(local.id).then(data => {
      local.lat = data.lat();
      local.lng = data.lng()

      loading.dismiss();
      this.viewCtrl.dismiss(local);
    })
  }

  geocodePlaceId(placeId: string): Promise<google.maps.LatLng> {
    var self = this;

    return new Promise((resolve, reject) => {
      self.geocoder.geocode({ 'placeId': placeId }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          resolve(results[0].geometry.location);
        } else {
          reject(null);
          console.log('page > geocode > status > ', status);
        }
      });
    });
  }

  pesquisaCancelada() {
    this.statusLoading = this.loadingSituation.cancelado;
  }

  updateSearch() { //tem que usar "self" nesse metodo, pq senao da confusao com o this. Isso pq ta sendo usado JS dentro do TS
    let self = this;

    self.statusLoading = self.loadingSituation.carregando;
    self.locaisEncontrados = [];

    if (self.autocomplete == '') {
      return;
    }

    self.service.getPlacePredictions({
      input: self.autocomplete,
      componentRestrictions: {
        country: 'BR'
      }
    }, function (predictions, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        predictions.forEach(l => {
          var local = new GoogleMapsLocal(l.place_id, l.description);

          self.locaisEncontrados.push(local);
        });
      } else {
        console.log('page > getPlacePredictions > status > ', status);
      }

      self.statusLoading = self.loadingSituation.cancelado;
    });
  }
}