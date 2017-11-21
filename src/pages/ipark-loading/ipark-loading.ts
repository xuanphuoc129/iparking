import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppModule } from '../../providers/app-module';
import { IparkingProvider } from '../../providers/iparking/iparking';
import { HomePage } from '../home/home';
import firebase from 'firebase';
import { StorageProvider } from '../../providers/storage/storage';
import { AppController } from '../../providers/app-controller';
import { MapJsProvider } from '../../providers/map-js/map-js';

@IonicPage()
@Component({
  selector: 'page-ipark-loading',
  templateUrl: 'ipark-loading.html',
})
export class IparkLoadingPage {

  constructor(
    private mapModule : MapJsProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private storageModule: StorageProvider,
    private afa: AngularFireAuth,
    private mAppModule: IparkingProvider,
    private splash: SplashScreen,
    private mPlatform: Platform,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLeave() {
    this.splash.hide();
  }
  ionViewDidEnter() {
   
    AppController.getInstance().setToastController(this.toastCtrl);
    AppController.getInstance().setLoadingController(this.loadingCtrl);
    this.mAppModule.loadConfig().then(
      () => {
        this.onLoadedConfig();
      }
    );
  }

  onLoadedConfig() {
    // setTimeout(() => {
    // }, 3000);
    let assets = this.mAppModule.getAppConfig().get("resources");
    AppModule.getInstance().getResourceLoader().load(assets).then(
      () => {
        this.onLoaded();
      }
    );
  }

  onLoaded() {
    this.mAppModule.getAllParks().then((res : any)=>{
      if(res){
        this.mapModule.parks = res;
        console.log(this.mapModule.parks);
        this.storageModule.isLogIn().then((res)=>{
          if(res){
            this.navCtrl.setRoot(HomePage, {
              animated: false
            })
          }else{
            this.navCtrl.setRoot("WellComePage", {
              animated: false
            })
          }
        }).catch((err)=>{})
      }
    }).catch((err)=>{})
   

  }

}
