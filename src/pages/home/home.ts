import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NavController, Searchbar } from 'ionic-angular';

import firebase from 'firebase'
import { GoogleMapProvider } from '../../providers/google-map/google-map';
import { MapJsProvider } from '../../providers/map-js/map-js';
import { IparkingProvider } from '../../providers/iparking/iparking';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Searchbar) searchBar: Searchbar;
  @ViewChild("divSearch") divSearch: ElementRef;
  @ViewChild('searchbar', { read: ElementRef }) searchbar: ElementRef;
  constructor(
    private mAppModule: IparkingProvider,
    private rd2: Renderer2,
    private mapModule: MapJsProvider,
    public navCtrl: NavController) {

  }
  ionViewDidLoad() {
    this.mAppModule.getAllParks().then((res: any) => {
      if (res) {
        this.mapModule.parks = res;
        this.goToLocation();
        this.mapModule.setNavController(this.navCtrl);
      }
    })
  }
  goToLocation() {
    this.mapModule.getLocation().then((res) => {
      if (res) {
        this.mapModule.initMap("map", res,true);
        // this.getInfoLocation(res);
      }
    })
  }
  infoLocation: string = "Lorem";
  // getInfoLocation(position) {
  //   this.mapModule.geocodeLatLng(position).then((res: any) => {
  //     if (res) {
  //       this.infoLocation = res;
  //     }
  //   }).catch((err) => { })
  // }
  goToSearchPage() {
    this.navCtrl.push("SearchPage");
  }
  isShowSearchBar: boolean = false;
  showSearchBar() {
    if (!this.isShowSearchBar) {
      this.isShowSearchBar = !this.isShowSearchBar;
      setTimeout(() => {
        this.searchBar.setFocus();
        this.mapModule.initAutocomplete(this.searchbar);
      }, 150);
    } else {
      this.rd2.addClass(this.divSearch.nativeElement, "slideOutUp");
      setTimeout(() => {
        this.rd2.removeClass(this.divSearch.nativeElement, "slideOutUp");
        this.isShowSearchBar = !this.isShowSearchBar;
        // this.searchBar.clearInput();
        // console.log(this.searchBar.value);
        this.searchBar.setValue('');
        this.mapModule.geocodeLatLng(this.mapModule.getCenterMap()).then((res: any) => {
          if (res) {
            this.infoLocation = res;
          }
        })
      }, 400);
    }
  }


}
