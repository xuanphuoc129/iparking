import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';
import { ElementRef } from '@angular/core/src/linker/element_ref';
import { IparkingProvider } from '../iparking/iparking';
import { Parks } from '../iparking/class/parks';
import { NavController } from 'ionic-angular/navigation/nav-controller';

declare var google;


/*
  Generated class for the MapJsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapJsProvider {
  private mNavController : NavController = null;
  constructor(
    private mAppModule: IparkingProvider,
    private geolocation: Geolocation,
    public http: HttpClient) {
    console.log('Hello MapJsProvider Provider');
    this.currentLocation = new google.maps.LatLng(20.28323, 105.322332);
  }
  currentLocation: any;
  mapOption: any;
  map: any;
  geocoder = new google.maps.Geocoder;
  public nowArress : string = '';
  public parks = new Array<Parks>();

  public setNavController(nav: NavController) {
    if (this.mNavController) return;
    this.mNavController = nav;
  }
  getLocation() {
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then((res) => {
        if (res) {
          this.currentLocation = {
            lat: res.coords.latitude,
            lng: res.coords.longitude
          }
          resolve(this.currentLocation);
        }
      }).catch((err) => {
        alert("Can't get your location");
        resolve(this.currentLocation);
      })
    })

  }
  initMap(mapID: string, position?: any, event?: boolean): void {
    let mapElement = document.getElementById(mapID);
    if (position) {
      this.currentLocation = new google.maps.LatLng(position.lat, position.lng);
    }
    if (mapElement) {
      this.setMapoptionDefault(this.currentLocation);
      this.map = new google.maps.Map(mapElement, this.mapOption);
      this.addMarker(this.imageLocation, this.currentLocation);
      if(event){
        this.addMoveEvent();
        setTimeout(() => {
          this.getOwnerInMap();
        }, 300);
      }
    }
  }
  addMoveEvent() {
    console.log("add event");
    
    this.map.addListener('center_changed', () => {
      this.getOwnerInMap();
    })
  }
  setMapoptionDefault(position) {
    this.mapOption = {
      center: position,
      zoom: 14,
      tilt: 24
    }
    return this.mapOption;
  }
  markers = [];
  imageOwner = "./assets/ipark/icon/parking.png";
  imageLocation = "./assets/ipark/icon/placeholder.png"

  addMarker(icon: any, position: any, content?: any, park?: Parks) {
    console.log("addmarker");
    
    let marker = new google.maps.Marker({
      map: this.map,
      icon: icon,
      // animation: google.maps.Animation.DROP,
      position: position
    });
    if(park){
      var label = {
        color: 'black',
        fontWeight: 'bold',
        text: park.parkID
      }
      marker.setLabel(label);
    }
    if (content) {
      if(park){
        this.addInfoWindow(marker, content,park);
      }else{
        this.addInfoWindow(marker, content);
      }
      this.markers.push(marker);
      return marker;
    } else {
      this.geocodeLatLng(position).then((res) => {
        if (res) {
          let content = res;
          if(park){
            this.addInfoWindow(marker, content,park);
          }else{
            this.addInfoWindow(marker, content);
          }
          this.markers.push(marker);
          return marker;
        }
      })
    }

  }
  setMapOnAll(map) {
    if(!this.markers || this.markers.length==0){return;}
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
  removeMarker(marker): boolean {

    if (this.markers.length > 0) {
      for (let i = 0; i < this.markers.length; i++) {
        if (this.markers[i].getPosition().lat() == marker.ILatLng.lat && this.markers[i].getPosition().lng() == marker.ILatLng.lng) {
          this.markers.splice(i, 1);
          return true;
        }
      }
    }
    return false;
  }
  getCenterMap() {
    return this.map.getCenter();
  }

  addInfoWindow(marker, content, park?: Parks) {
    
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    if(park){
      infoWindow.setContent(park.parkName);
    }
    google.maps.event.addListener(marker, 'click', () => {
      if(park){
      this.nowArress = park.parkAddress;
      console.log(park);
      if(this.mNavController){
        this.mNavController.push("ParkDetailPage",{
          park: park
        })
      }
      }
      infoWindow.open(this.map, marker);
      // this.nowArress = content;
    });

  }

  geocodeLatLng(position) {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ 'location': position }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            this.nowArress = results[0].formatted_address;
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
      // this.deleteAllMarkers();
      this.addMarker(this.imageLocation, location);

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


  isMapReady: boolean = false;
  parksFilter = [];
  getOwnerInMap() {
    console.log(this.parks.length);
    
    let bounds = this.map.getBounds();

    let temp = [];
    if (this.parks.length > 0) {
      for (let i = 0; i < this.parks.length; i++) {
        if (bounds.contains(new google.maps.LatLng(this.parks[i].ILatLng.lat, this.parks[i].ILatLng.lng))) {
          temp.push(this.parks[i]);
          // this.addMarker(this.imageOwner, this.parks[i].ILatLng, this.parks[i].parkAddress);
        }
      }
    }

    if (!temp || temp.length == 0) { return; }
    if (!this.parksFilter || this.parksFilter.length == 0) {
      this.parksFilter = temp;
      for (let j = 0; j < this.parksFilter.length; j++) {
        this.addMarker(this.imageOwner, this.parksFilter[j].ILatLng, this.parksFilter[j].parkAddress,this.parksFilter[j]);
      }
    } else {
      // console.log("newresult", temp.length);
      // console.log("parksfilter", this.parksFilter.length);
      // console.log("markers", this.markers.length);
      var check: boolean = false;

      //add new element
      for (let m = 0; m < temp.length; m++) {
        let newpark = temp[m];
        check = false;
        for (let n = 0; n < this.parksFilter.length; n++) {
          if (newpark.parkID == this.parksFilter[n].parkID) {
            check = true;
            break;
          }
        }
        if (!check) {
          this.parksFilter.push(newpark);
          this.addMarker(this.imageOwner, newpark.ILatLng, newpark.parkAddress,newpark);
        }
      }
      //remove element 
      for (let k = this.parksFilter.length - 1; k > 0; k--) {
        let park = this.parksFilter[k];
        check = false;
        for (let z = 0; z < temp.length; z++) {
          if (park.parkID == temp[z].parkID) {
            check = true;
            break;
          }
        }
        if (!check) {
          this.parksFilter.splice(k, 1);
          this.markers.splice(k, 1);
        }
      }

      // console.log("parksfilter", this.parksFilter.length);
      // console.log("markers", this.markers.length);
      
    }

  }
  // removeElemnt(element,array){
  //   for(let i = 0 ; i < array.length; i ++){
  //     if(element == array[i]){
  //       array.splice(i,1);
  //       break;
  //     }
  //   }
  //   return array;
  // }

}
