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
import { LocalServiceProvider } from "../../providers/local-service/local-service";

//Models
import { } from "../../models/";
import { Usuario } from "../../models/usuario";
import { Local } from "../../models/local";

//Markers
import { UsuarioMarker } from './usuario.marker';
import { LocalMarker } from "./local.marker";
import { UsuarioLocalizacao } from '../../models/usuarioLocalizacao';

@IonicPage()
@Component({
  selector: 'page-equipe-contexto',
  templateUrl: 'equipe-contexto.html',
})
export class EquipeContextoPage {
  @ViewChild('map') mapElement: ElementRef;
  private map: google.maps.Map;
  // private markers: google.maps.Marker[] = [];
  private usuarioMarkers: any = [];
  private localMarkers: any = [];
  private locationLoading: boolean = false;

  private bounds = new google.maps.LatLngBounds();

  constructor(
    public db: AngularFireDatabase,
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    public geolocation: Geolocation,
    public localService: LocalServiceProvider,
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
      //disableDefaultUI: true //https://developers.google.com/maps/documentation/javascript/examples/control-disableUI?hl=pt-br
      zoomControl: false,
      mapTypeControl: true,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: true,
      fullscreenControl: false
    });

    google.maps.event.addListenerOnce(this.map, 'tilesloaded', (event) => {
      // https://gist.github.com/aknosis/997144 
      // https://developers.google.com/maps/documentation/javascript/events
      // https://forum.ionicframework.com/t/calling-a-function-from-a-listener/58814#post_2
      this.carregarPins();

      this.map.setOptions({ maxZoom: 15 });
      this.map.fitBounds(this.bounds);
      this.map.setOptions({ maxZoom: null });
    });
  }

  private carregarPins() {
    this.carregarLocais();
    this.carregarUsuarios();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad")
    console.log("ionViewDidLoad -- carregou")
  }

  centerMapOnCurrentPosition() {
    this.locationLoading = true;

    this.currentPosition().then(data => {
      this.map.setCenter(data);
      this.locationLoading = false;
    }).catch(error => {
      this.locationLoading = false;
    });
  }

  private currentPosition(): Promise<google.maps.LatLng> {
    return new Promise((resolve, reject) => {
      let geolocationOptions = {
        'timeout': 10000
      }

      this.geolocation.getCurrentPosition(geolocationOptions).then((resp) => {
        let pos = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

        resolve(pos);
      }).catch((error) => {
        console.log('Error getting location', error);
        reject(error);
      });
    });
  }

  private carregarLocais() {
    this.localService.getLocaisPorEquipe(this.sessaoService.equipe.$key).subscribe((locais: Local[]) => {
      this.clearLocalMarkers();

      locais.forEach(local => {
        this.addMarcadoLocal(local);
      });
    });

  }
  private carregarUsuarios() {
    // this.db.list(`${dataBaseStorage.UsuarioLocalizacao}/${this.sessaoService.equipe.$key}`).map((items) => {
    //   console.log(items)
    //   return items.map(item => {

    //     for (var index = 0; index < this.sessaoService.equipe.membros.length; index++) {
    //       if (this.sessaoService.equipe.membros[index].$key == item.$key) {
    //         item.usuario = this.sessaoService.equipe.membros[index]
    //         break;
    //       }
    //     }

    //     return item;
    //   });
    // })
    this.usuarioService.getMonitoriasEquipe(this.sessaoService.equipe.$key).subscribe((usuarioLocalizacoes: UsuarioLocalizacao[]) => {
      this.clearUsuarioMarkers()

      usuarioLocalizacoes.forEach(usuarioLocalizacao => {
        this.sessaoService.equipe.membros.forEach(membro => { })

        for (var index = 0; index < this.sessaoService.equipe.membros.length; index++) {
          if (this.sessaoService.equipe.membros[index].$key == usuarioLocalizacao.keyUsuario) {
            usuarioLocalizacao.usuario = this.sessaoService.equipe.membros[index]

            this.addMarcadoMembro(usuarioLocalizacao);
            break;
          }
        }

      });
    });
  }

  private addMarcadoLocal(local: Local) {
    let latLng = new google.maps.LatLng(local.coordenadas.lat, local.coordenadas.lng);

    let parametros = {
      // label: usuario.nome,
      // img: usuario.fotoUrl,
    }

    let marcador = new LocalMarker(latLng, this.map, parametros);
    this.bounds.extend(marcador.getPosition());
    this.localMarkers.push(marcador);
  }

  private addMarcadoMembro(usuarioLocalizacao: UsuarioLocalizacao) {
    let latLng = new google.maps.LatLng(usuarioLocalizacao.lat, usuarioLocalizacao.lng);

    let parametros = {
      label: usuarioLocalizacao.usuario.nome,
      img: usuarioLocalizacao.usuario.fotoUrl,
    };

    let marcador = new UsuarioMarker(latLng, this.map, parametros);
    this.bounds.extend(marcador.getPosition());
    this.usuarioMarkers.push(marcador);
  }

  private addMarcadorNormal(latLng: google.maps.LatLng, usuario: Usuario) {
    let normal = new google.maps.Marker({
      position: latLng,
      map: this.map,
      animation: google.maps.Animation.DROP,
    });

    this.usuarioMarkers.push(normal);
  }

  private clearUsuarioMarkers() {
    for (var index = 0; index < this.usuarioMarkers.length; index++) {
      this.usuarioMarkers[index].setMap(null);
    }
    this.usuarioMarkers = [];
  }

  private clearLocalMarkers() {
    for (var index = 0; index < this.localMarkers.length; index++) {
      this.localMarkers[index].setMap(null);
    }
    this.localMarkers = [];
  }

  //https://forum.ionicframework.com/t/custom-modal-alert-with-html-form/47980/11#post_11
  //Ao clicar sobre algum item
}