import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';
import { ElementRef } from '@angular/core/src/linker/element_ref';
import { IparkingProvider } from '../iparking/iparking';
import { Parks } from '../iparking/class/parks';

declare var google;


/*
  Generated class for the MapJsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapJsProvider {
  constructor(
    private mAppModule: IparkingProvider,
    private geolocation: Geolocation,
    public http: HttpClient) {
    console.log('Hello MapJsProvider Provider');
    this.currentLocation = new google.maps.LatLng(20.28323,105.322332);
  }
  currentLocation: any;
  mapOption: any;
  map: any;
  geocoder = new google.maps.Geocoder;
  getLocation(){
    return new Promise((resolve,reject)=>{
      this.geolocation.getCurrentPosition().then((res)=>{
        if(res){
          this.currentLocation = {
            lat: res.coords.latitude,
            lng: res.coords.longitude
          }
          resolve(this.currentLocation);
        }
      })
    })
   
  }
  initMap(mapID: string, position?: any): void {
    let mapElement = document.getElementById(mapID);
    if(position){
      this.currentLocation = new google.maps.LatLng(position.lat, position.lng);
    }
    if (mapElement) {
      this.setMapoptionDefault(this.currentLocation);
      this.map = new google.maps.Map(mapElement, this.mapOption);
      this.addMarker(this.imageLocation,this.currentLocation);
      // this.geocodeLatLng(this.map);
      this.addClickEvent();
      
    }
  }
  dem = 0;
  addClickEvent(){
    this.map.addListener('click',(ev)=>{
      console.log(ev.latLng);
      this.addMarker(this.imageOwner,ev.latLng);
      let newpark = new Parks();
      newpark.setParkID("MH"+this.dem);
      newpark.setILatlng(ev.latLng);
      newpark.setOwnerID("OW"+this.dem);
      this.geocodeLatLng(ev.latLng).then((res: any)=>{
        if(res){
          newpark.setAddress(res);
          this.mAppModule.addParks(newpark).then((res)=>{
            if(res){
              console.log(newpark.parkID);
              
            }
          });
        }
      });

    }) 
  }
  setMapoptionDefault(position) {
    this.mapOption = {
      center: position,
      zoom: 14 ,
      tilt: 22
    }
    return this.mapOption;
  }
  markers = [];
  imageOwner = {
    url: "../assets/ipark/icon/parking.png"
  };
  imageLocation = {
    url: "../assets/ipark/icon/placeholder.png"
  };
  addMarker(icon: any,position :any, content?:any) {
    let marker = new google.maps.Marker({
      map: this.map,
      icon: icon,
      animation: google.maps.Animation.DROP,
      position: position,
    });
    if(content){
      this.addInfoWindow(marker, content);
      this.markers.push(marker);
      return marker;
    }else{
      this.geocodeLatLng(position).then((res) => {
        if (res) {
          let content = res;
          this.addInfoWindow(marker, content);
          this.markers.push(marker);
          return marker;
        }
      })
    }
   
  }
  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }
  clearMarkers() {
    this.setMapOnAll(null);
  }

  deleteAllMarkers() {
    this.clearMarkers();
    this.markers = [];
  }
  getCenterMap(){
    return this.map.getCenter();
  }

  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  geocodeLatLng(position) {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ 'location': position }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            resolve(results[0].formatted_address);
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });
    })
  }

  addressElement: HTMLInputElement = null;

  initAutocomplete(searchBar: ElementRef): void {
    // reference : https://github.com/driftyco/ionic/issues/7223
    this.addressElement = searchBar.nativeElement.querySelector('.searchbar-input');
    this.createAutocomplete(this.addressElement).subscribe((location) => {
      console.log('Searchdata', location);

      this.map.setOptions(this.setMapoptionDefault(location));
      this.deleteAllMarkers();
      this.addMarker(this.imageLocation,location);

    });
  }
  createAutocomplete(addressEl: HTMLInputElement): Observable<any> {
    const autocomplete = new google.maps.places.Autocomplete(addressEl);
    autocomplete.bindTo('bounds', this.map);
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          sub.error({
            message: 'Autocomplete returned place with no geometry'
          });
        } else {
          console.log('Search Lat', place.geometry.location.lat());
          console.log('Search Lng', place.geometry.location.lng());
          sub.next(place.geometry.location);
          //sub.complete();
        }
      });
    });
  }

  
}
