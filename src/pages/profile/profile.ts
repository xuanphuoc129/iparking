import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Users } from '../../providers/users/user';
import { UsersProvider } from '../../providers/users/users';

import { StorageProvider } from '../../providers/storage/storage';
import {AngularFireAuth} from 'angularfire2/auth';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user  : Users;
  constructor(
    public afa: AngularFireAuth,
    private store : StorageProvider,
    private userModule: UsersProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.user = new Users();
  }

  ionViewDidEnter() {
    this.userModule.getUserDetail().then((res : any)=>{
      if(res){
        this.user = res;
      }
    }).catch((err)=>{})
  }

  back(){
    this.navCtrl.pop();
  }
  signout(){
    this.afa.auth.signOut().then(()=>{
      this.store.setLogin(0);
      this.navCtrl.setRoot("WellComePage");
    }).catch((err)=>{
      alert(err);
    })
  }
  
}
