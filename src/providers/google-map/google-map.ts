import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  ILatLng
 } from '@ionic-native/google-maps';
/*
  Generated class for the GoogleMapProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GoogleMapProvider {
  map: GoogleMap;
  currentPosition : ILatLng = {
    lat: 37.422359,
    lng: -122.084344
  };
  constructor(
    private geolocation: Geolocation) {
    this.currentPosition.lat = 37.422359;
    this.currentPosition.lng = -122.084344;
  }
  getLocation(){
    return new Promise((resolve,reject)=>{
        this.geolocation.getCurrentPosition().then((res)=>{
          if(res){
            this.currentPosition.lat = res.coords.latitude;
            this.currentPosition.lng = res.coords.longitude;
           
            resolve(true);
          }
        }).catch((err)=>{
          alert("Can't get your position!");
        })
    }); 
  }
  loadMap(divID : string, position?: ILatLng) {
      
      let mapElem = document.getElementById(divID);

      if(position){
        this.currentPosition = position;
      }
      let cameraOption: CameraPosition<ILatLng> = {
        target: {
          lat: this.currentPosition.lat,
          lng: this.currentPosition.lng
        },
        zoom: 14,
        tilt: 0
      }
      
        this.map = GoogleMaps.create(divID,{
          camera: cameraOption,
          mapType: 'MAP_TYPE_ROADMAP'
        });
    
        // Wait the MAP_READY before using any methods.
        this.map.one(GoogleMapsEvent.MAP_READY)
          .then(() => {
            console.log('Map is ready!');
    
            // Now you can use all methods safely.
            this.map.addMarker({
                title: 'Ionic',
                icon: 'blue',
                animation: 'DROP',
                position:{
                  lat: this.currentPosition.lat,
                  lng: this.currentPosition.lng
                }
              })
              .then(marker => {
                marker.on(GoogleMapsEvent.MARKER_CLICK)
                  .subscribe(() => {
                    alert('clicked');
                  });
              });
    
          });
      }
}
