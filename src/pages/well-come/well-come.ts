import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the WellComePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-well-come',
  templateUrl: 'well-come.html',
})
export class WellComePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WellComePage');
  }

  signup(){
    this.navCtrl.push("SignUpPage");
  }
  signin(){
    this.navCtrl.push("LoginPage");
  }

}
