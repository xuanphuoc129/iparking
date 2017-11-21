import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Searchbar } from 'ionic-angular';
import { Parks } from '../../providers/iparking/class/parks';
import { HomePage } from '../home/home';
import { UsersProvider } from '../../providers/users/users';
import { IparkingProvider } from '../../providers/iparking/iparking';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  @ViewChild(Searchbar) searchBar: Searchbar;

  listParks = new Array<Parks>();

  constructor(
    private mAppModule: IparkingProvider,
    private userModule: UsersProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.loadParks();
  }

  ionViewDidEnter() {
    this.getListFavorite();
    setTimeout(() => {
    this.searchBar.setFocus();
    }, 500);
  }
  listFavorite = [];
  getListFavorite()
  {
    this.userModule.getAllFavorite().then((res: any)=>{
      if(res){
        this.listFavorite = res;
        console.log(this.listFavorite);
      }
    }).catch((err)=>{})
  }
  loadParks(){
    this.mAppModule.getAllParks().then((res: any)=>{
      if(res){
        this.listParks= res;
      }
    }).catch((err)=>{})
  }
  closeView(){
    if(this.navCtrl.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.navCtrl.setRoot(HomePage);
    }
  }
  viewParkDetail(park: Parks){
    this.navCtrl.push("ParkDetailPage",{
      park: park
    });
  }
  isFavorite(park): boolean{
    if(this.listFavorite.length > 0){
      for (let index = 0; index < this.listFavorite.length; index++) {
        if(park.parkID==this.listFavorite[index]){
          return true;
        }
      }
    }
   return false;
  }

}
