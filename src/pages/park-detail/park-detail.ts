import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Parks } from '../../providers/iparking/class/parks';
import { GoogleMapProvider } from '../../providers/google-map/google-map';
import { HomePage } from '../home/home';
import { UsersProvider } from '../../providers/users/users';
import { MapJsProvider } from '../../providers/map-js/map-js';

/**
 * Generated class for the ParkDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface Items {
  icon: string;
  name: string;
}

@IonicPage()
@Component({
  selector: 'page-park-detail',
  templateUrl: 'park-detail.html',
})
export class ParkDetailPage {
  park: Parks;
  isOpen: string;
  isValidate: string;
  listItems = new Array<Items>();
  constructor(
    private mapModule: MapJsProvider,
    private userModule: UsersProvider,
    private googleMapModule: GoogleMapProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.park = new Parks();
    this.getItems();
  }

  getItems() {
    if (!this.park.isOpen) {
      this.isOpen = "Chưa Hoạt Động";
    } else {
      this.isOpen = "Đang mở cửa";
    }
    if (!this.park.isValidate) {
      this.isValidate = "Doanh nghiệp chưa được xác nhận";
    } else {
      this.isValidate = "Xác nhận doanh nghiệp";
    }
    this.listItems = [
      { icon: 'cloudy', name: this.park.parkName},
      { icon: 'flag', name: this.park.parkID},
      { icon: "pin", name: this.park.parkAddress },
      { icon: "call", name: this.park.parksHotLine },
      { icon: "clock", name: this.isOpen },
      { icon: "lock", name: this.isValidate }
    ]
  }

  ionViewDidEnter() {
    if (this.navParams.get("park")) {
      this.park = this.navParams.get("park");
      this.mapModule.initMap("parkMapID",this.park.ILatLng,false);
      this.getItems();
    }else{
      this.mapModule.initMap("parkMapID");
    }
    this.userModule.getFavorite(this.park.parkID).then((res: any) => {
      if (res) {
        this.isActiveStar = true;
      } else {
        this.isActiveStar = false;
      }
    });
    if (this.navParams.get("park")) {
      this.park = this.navParams.get("park");
    }
  }
  isActiveStar: boolean = false;
  activeStar() {
    this.isActiveStar = !this.isActiveStar;
    this.userModule.addfavorite(this.park.parkID, this.isActiveStar);
  }
  closeView() {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot(HomePage);
    }
  }

  goToSign() {
    this.navCtrl.push("SignupServicePage");
  }

}
