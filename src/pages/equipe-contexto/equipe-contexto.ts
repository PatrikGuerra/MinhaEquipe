import { Component, NgZone, ElementRef, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { App, LoadingController, NavController, NavParams, ViewController, PopoverController } from 'ionic-angular';

import { } from '@types/googlemaps';

import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase';

import { dataBaseStorage } from "../../app/app.constants";

//Service
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";

// Popover
import { ContextoPopoverPage } from "../contexto-popover/contexto-popover";

@Component({
  selector: 'page-equipe-contexto',
  templateUrl: 'equipe-contexto.html',
})
export class EquipeContextoPage {
  @ViewChild('map') mapElement: ElementRef;
  private map: google.maps.Map;
  private markers: google.maps.Marker[] = [];

  constructor(
    public db: AngularFireDatabase,
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,

    public geolocation: Geolocation,
    public sessaoService: SessaoServiceProvider,
    private usuarioService: UsuarioServiceProvider,

    private app: App,
    public popoverCtrl: PopoverController) {

  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter")
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: {
        lat: -29.166564,
        lng: -51.1863117
      },
      zoom: 15, //https://developers.google.com/maps/documentation/static-maps/intro#Zoomlevels
      disableDefaultUI: true //https://developers.google.com/maps/documentation/javascript/examples/control-disableUI?hl=pt-br
    });

    //this.centerMapOnCurrentPosition();
    this.carregarLocalizacoes();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad")
    console.log("ionViewDidLoad -- carregou")
    //  this.centerMapOnCurrentPosition();
    //  this.carregarLocalizacoes();
  }

  public abrirPopover(myEvent) {
    let contextoPopoverPage = this.popoverCtrl.create(ContextoPopoverPage);

    contextoPopoverPage.present({
      ev: myEvent
    });
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

  private carregarLocalizacoes() {
    this.db.list(`${dataBaseStorage.UsuarioLocalizacao}/${this.sessaoService.equipe.$key}`).map((items) => {
      console.log(items)
      return items.map(item => {

        for (var index = 0; index < this.sessaoService.equipe.membros.length; index++) {
          if (this.sessaoService.equipe.membros[index].$key == item.$key) {
            item.usuario = this.sessaoService.equipe.membros[index]
            break;
          }
        }

        return item;
      });
    }).subscribe(data => {
      this.clearMarkers()
      console.log(data)

      data.forEach(element => {
        console.log(element)
        this.setMarker(new google.maps.LatLng(element.lat, element.lng))
      });
    })
  }

  // private aplicaMarcadores(data) {
  //   console.log(data)

  //   data.forEach(element => {
  //     console.log(element)
  //     this.setMarker(new google.maps.LatLng(element.lat, element.lng))
  //   });
  // }

  private setMarker(latLng: google.maps.LatLng) {
    let newMarker = new google.maps.Marker({
      position: latLng,
      map: this.map
    });

    this.markers.push(newMarker);
  }



  clearMarkers() {
    for (var index = 0; index < this.markers.length; index++) {
      this.markers[index].setMap(null);
    }
  }










}







                      // Map Initilize function 
                      // function initMap() {
                      //   var options = {
                      //     timeout: 10000,
                      //     enableHighAccuracy: true
                      //   };
                      //   $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
                      //     var latLng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                      //     var mapOptions = {
                      //       center: latLng,
                      //       zoom: 15,
                      //       disableDefaultUI: true,
                      //       mapTypeId: google.maps.MapTypeId.ROADMAP
                      //     };
                      //     map = new google.maps.Map(document.getElementById("map"), mapOptions);
                      //     //Wait until the map is loaded
                      //     //Load the markers
                      //     loadMarkers();
                      //     //});
                      //   }, function(error) {
                      //     console.log(error);
                      //     console.log("Could not get location");
                      //     //Load the markers
                      //     loadMarkers();
                      //   });
                      // }

                      //load marker using rest api


                      /*
                      EDITANDO
                      function loadMarkers() {
                        CommonService. ();
                        YOUR REST API SERVICE.then(function(res) {
                          angular.forEach(res, function(value, key) {
                            var record = value;
                            console.log(record);
                            var image = {
                              url: 'img/ic_map_pin_gray.png', // custom background image (marker pin)
                              scaledSize: new google.maps.Size(70, 70),
                            };
                            var markerPos = new google.maps.LatLng(record.lat, record.long);
                            //Add the markerto the map
                            var marker = new google.maps.Marker({
                              map: map,
                              animation: google.maps.Animation.DROP,
                              position: markerPos,
                              icon: image,
                            });
                            var img_src = record.profilePic;
                            var overlay = new CustomMarker(
                              markerPos,
                              map, {image: img_src}
                            );
                          });
                        }).catch(function(error, status, headers, config) {
                          console.log(error);
                        });
                      }


                      //CustomMarker function 
                      function CustomMarker(latlng, map, args) {
                        this.latlng = latlng;
                        this.args = args;
                        this.setMap(map);
                      }
                      CustomMarker.prototype = new google.maps.OverlayView();

                      CustomMarker.prototype.draw = function() {
                        var self = this;
                        var div = this.div;
                        if (!div) {
                          div = this.div = document.createElement('img');
                          div.src = self.args.image;
                          div.className = 'marker';
                          div.style.position = 'absolute';
                          div.style.cursor = 'pointer';
                          div.style.width = '35px';
                          div.style.height = '35px';
                          div.style.borderRadius  = '50%';

                          if (typeof(self.args.marker_id) !== 'undefined') {
                            div.dataset.marker_id = self.args.marker_id;
                          }

                          google.maps.event.addDomListener(div, "click", function(event) {
                            google.maps.event.trigger(self, "click");
                          });

                          var panes = this.getPanes();
                          panes.overlayImage.appendChild(div);
                        }
                        var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

                        if (point) {
                          div.style.left = (point.x - 18) + 'px'; // set custom (i set it as i want to set in map )
                          div.style.top = (point.y - 56) + 'px'; //set custom (i set it as i want to set in map )
                        }
                      };
                      */