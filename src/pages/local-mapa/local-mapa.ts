import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

import { } from '@types/googlemaps';
import { Geolocation } from '@ionic-native/geolocation';

///import {Component} from '@angular/core';
//import {NavController, ModalController} from 'ionic-angular';
import { MapsAutoCompletePage } from '../maps-auto-complete/maps-auto-complete';

import { GoogleMapsLocal } from "../../models/google-maps/googleMapsLocal";
import { Coordenadas } from "../../models/coordenadas";
@Component({
  selector: 'page-local-mapa',
  templateUrl: 'local-mapa.html',
})

export class LocalMapaPage {
  //https://stackoverflow.com/questions/36064697/how-to-install-typescript-typings-for-google-maps#answer-42733315
  //https://www.joshmorony.com/ionic-2-how-to-use-google-maps-geolocation-video-tutorial/

  @ViewChild('map') mapElement: ElementRef;
  map: google.maps.Map;
  marker: google.maps.Marker;
  private geocoder = new google.maps.Geocoder();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private viewCtrl: ViewController,
    public geolocation: Geolocation) {

    console.log("this.navParams.data")
    console.log(this.navParams.data)
  }

  ngOnInit() {
    console.log('ngOnInit LocalMapaPage');
  }

  ionViewWillEnter() {
    this.carregarMapa()
  }

  valida() {
    console.log(this.marker);
    console.log(this.marker.getPosition());
    console.log(this.marker.getPosition().lat());
    console.log(this.marker.getPosition().lng());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocalMapaPage');
  }

  confirmar() {
    var coordenada: Coordenadas = new Coordenadas(this.marker.getPosition().lat(), this.marker.getPosition().lng());
    console.log(Coordenadas)
    this.viewCtrl.dismiss({
      coordenada: coordenada
    });
  }

  cancelar() {
    this.viewCtrl.dismiss();
  }

  setMapOnAll(map) {
    if (this.marker) {
      this.marker.setMap(map);
    }
  }

  clearMarkers() {
    this.setMapOnAll(null);
  }

  showMarkers() {
    this.setMapOnAll(this.map);
  }

  setMarker(location) {
    var self = this;

    this.marker = new google.maps.Marker({
      position: location,
      map: self.map
    });
  }

  pesquisaLocal() {
    let mapsAutoCompletePage = this.modalCtrl.create(MapsAutoCompletePage);

    mapsAutoCompletePage.onDidDismiss((data: GoogleMapsLocal) => {
      if (data) {
        this.clearMarkers()

        this.setMarker(new google.maps.LatLng(data.lat, data.lng))

        console.log(data);
      } else {
        console.log("veio nada");
      }
    });

    mapsAutoCompletePage.present();
  }

  //https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse?hl=pt-br
  geocodePlaceId(latlng: any) {//: Promise<google.maps.LatLng> {
    var self = this;

    self.geocoder.geocode({ 'location': latlng }, function (results, status) {
      console.log("results");
      console.log(results);
      console.log("status");
      console.log(status);

    });
  }

  carregarMapa() {
    this.geolocation.getCurrentPosition().then((geoPosition) => {


      let latLng = null;
      console.log(this.navParams.data.coordenadas)
      if (this.navParams.data.coordenadas) {
        latLng = new google.maps.LatLng(this.navParams.data.coordenadas.lat, this.navParams.data.coordenadas.lng)

      } else {
        latLng = new google.maps.LatLng(geoPosition.coords.latitude, geoPosition.coords.longitude);
      }

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      var self = this;

      this.map.addListener('click', function (e) {
        console.log(e)
        console.log(e.latLng)
        self.clearMarkers()
        self.setMarker(e.latLng)
      });

      self.setMarker(latLng)

    }, (error) => {
      console.error(error)
    });
  }
}