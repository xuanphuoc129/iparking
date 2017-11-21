import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Users } from '../../providers/users/user';
import { UsersProvider } from '../../providers/users/users';
import { FirebaseLoginProvider } from '../../providers/firebase-login/firebase-login';
import { AppController } from '../../providers/app-controller';

/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  user : Users;
  constructor(
    private loginModule: FirebaseLoginProvider,
    private userProvider: UsersProvider,
    public alertCtrl :AlertController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.user = new Users();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }
  submitEmail = false;
  
  inputEmail() {
    this.submitEmail = false;
  }

  back(){
    if(this.navCtrl.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.navCtrl.setRoot("WellComePage");
    }
  }

  reset(){
    if (!this.user.email) {
      this.submitEmail = true;
      return;
    }
    if (!this.loginModule.validateEmail(this.user.email)) {
      AppController.getInstance().doShowToast("Email không hợp lệ", 2000, "bottom");
      return;
    }

    let alert = this.alertCtrl.create({
      buttons: ['Ok']
    });

    this.userProvider.passwordreset(this.user.email).then((res: any)=>{
      if(res){
        alert.setTitle('Email sent');
        alert.setSubTitle('Please follow the instruction in the email to reset your password');
        alert.present();
      }else{
        alert.setTitle('Failed');
      }
    })
  }
}
