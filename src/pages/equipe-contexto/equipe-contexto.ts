import { Component, NgZone, ElementRef, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicPage, LoadingController, NavController, NavParams, ViewController, PopoverController } from 'ionic-angular';

import { } from '@types/googlemaps';

import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase';

import { dataBaseStorage } from "../../app/app.constants";

//Service
import { SessaoServiceProvider } from "../../providers/sessao-service/sessao-service";
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";

import { CustomMarker } from './custom.marker';

//Import
import { Usuario } from "../../models/usuario";

@IonicPage()
@Component({
  selector: 'page-equipe-contexto',
  templateUrl: 'equipe-contexto.html',
})
export class EquipeContextoPage {
  @ViewChild('map') mapElement: ElementRef;
  private map: google.maps.Map;
  // private markers: google.maps.Marker[] = [];
  private markers: any = [];

  constructor(
    public db: AngularFireDatabase,
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    public geolocation: Geolocation,
    public sessaoService: SessaoServiceProvider,
    private usuarioService: UsuarioServiceProvider) {
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter")

    this.loadMap();
  }



  private loadMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: {
        lat: -29.166564,
        lng: -51.1863117
      },
      zoom: 15, //https://developers.google.com/maps/documentation/static-maps/intro#Zoomlevels
      disableDefaultUI: true //https://developers.google.com/maps/documentation/javascript/examples/control-disableUI?hl=pt-br
    });

    google.maps.event.addListenerOnce(this.map, 'tilesloaded', (event) => {
      // https://gist.github.com/aknosis/997144 
      // https://developers.google.com/maps/documentation/javascript/events
      // https://forum.ionicframework.com/t/calling-a-function-from-a-listener/58814#post_2
      this.fixMyPageOnce();
    });
  }

  private fixMyPageOnce() {
    this.carregarLocalizacoes();
    // do stuff
    // no need to remove the event listener
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad")
    console.log("ionViewDidLoad -- carregou")
    //  this.centerMapOnCurrentPosition();
    //  this.carregarLocalizacoes();
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
    }).subscribe(registros => {
      this.clearMarkers()

      registros.forEach(registroLocalizacaoUsuario => {   
        let latLnl = new google.maps.LatLng(registroLocalizacaoUsuario.lat, registroLocalizacaoUsuario.lng);

        this.addMarcadoMembro(latLnl, registroLocalizacaoUsuario.usuario)
      });
    })
  }

  private addMarcadoMembro(latLng: google.maps.LatLng, usuario: Usuario) {
    let parametros = {
      label: usuario.nome,
      img: usuario.fotoUrl,
    };
    let marcador = new CustomMarker(latLng, this.map, parametros);

    this.markers.push(marcador);
  }

  private addMarcadorNomal(latLng: google.maps.LatLng, usuario: Usuario) {
    let normal = new google.maps.Marker({
      position: latLng,
      map: this.map,
      animation: google.maps.Animation.DROP,
    });

    this.markers.push(normal);
  }

  private clearMarkers() {
    for (var index = 0; index < this.markers.length; index++) {
      this.markers[index].setMap(null);
    }
    this.markers = [];
  }

  //https://forum.ionicframework.com/t/custom-modal-alert-with-html-form/47980/11#post_11
  //Ao clicar sobre algum item
}