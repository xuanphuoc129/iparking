import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Users } from '../../providers/users/user';
import { HomePage } from '../home/home';
import { AppController } from '../../providers/app-controller';
import { FirebaseLoginProvider } from '../../providers/firebase-login/firebase-login';
import { UsersProvider } from '../../providers/users/users';

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  user: Users;
  constructor(
    private userModule: UsersProvider,
    private loginModule: FirebaseLoginProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.user = new Users();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  submitEmail = false;
  submitPassword = false;
  submitPhone = false;
  submitName = false;
  signup() {
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
    if (!this.loginModule.validatePassword(this.user.password)) {
      return;
    }
    if(!this.user.phoneNumber){
      this.submitPassword = true;
      return;
    }
    if(this.user.phoneNumber && this.user.phoneNumber.length < 10){
      AppController.getInstance().doShowToast("Số điện thoại không hợp lệ",2000,"bottom");
      return;
    }
    if(!this.user.displayName){
      this.submitName = true;
      return;
    }
    AppController.getInstance().doShowLoading(1000000);
    this.loginModule.creatUserWithEmailPassword(this.user).then((res)=>{
      if(res){
        this.loginModule.signInWithEmailPassword(this.user).then((res)=>{
          if(res){
            this.userModule.addUser(this.user).then((ress)=>{
              if(ress){
                AppController.getInstance().doCloseLoading();
                this.navCtrl.setRoot(HomePage);
              }
            }).catch((err)=>{})
          }else{
            AppController.getInstance().doCloseLoading();
          }
        }).catch((err)=>{})
      }
    }).catch((err)=>{})
  }
  inputEmail() {
    this.submitEmail = false;
  }
  inputPassword() {
    this.submitPassword = false;
  }
  inputPhone() {
    this.submitPhone = false;
  }
  inputName() {
    this.submitName = false;
  }
}
