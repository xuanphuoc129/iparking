import { Component, ViewChild, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseLoginProvider } from '../../providers/firebase-login/firebase-login';
import { HomePage } from '../home/home';
import { AppController } from '../../providers/app-controller';
import { UsersProvider } from '../../providers/users/users';
import { Users } from '../../providers/users/user';

import firebase from 'firebase';
import { StorageProvider } from '../../providers/storage/storage';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild("inputEmail") inputName;
  @ViewChild("inputPassword") inputDate;

  pageTitle: string = "";
  user: Users;
  constructor(
    private userModule: UsersProvider,
    private storaage: StorageProvider,
    private loginModule: FirebaseLoginProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.user = new Users();
  }

  ionViewDidEnter() {

  }
  closeView() {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot("WellComePage");
    }
  }
  

  submitEmail = false;
  submitPassword = false;
  signin() {
    if (!this.user.email) {
      this.submitEmail = true;
      return;
    }
    if (!this.loginModule.validateEmail(this.user.email)) {
      AppController.getInstance().doShowToast("Email không hợp lệ", 2000, "bottom");
      return;
    }
    if (!this.user.password) {
      this.submitPassword = true;
      return;
    }
    if(!this.loginModule.validatePassword(this.user.password)){
      return;
    }
    AppController.getInstance().doShowLoading(1000000);
    this.loginModule.signInWithEmailPassword(this.user).then((res)=>{
      if(res){
        AppController.getInstance().doCloseLoading();
        this.storaage.setLogin(1);
        this.navCtrl.setRoot(HomePage);
      }else{
        AppController.getInstance().doShowToast("Tài khoản không tồn tại",2000,"bottom");
      }
    }).catch((err)=>{})
  }
  inputEmail() {
    this.submitEmail = false;
  }
  inputPassword() {
    this.submitPassword = false;
  }
}
