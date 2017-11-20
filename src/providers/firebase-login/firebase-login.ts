import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { ModalController } from 'ionic-angular';

import { Users } from '../users/user';

import { AngularFireAuth } from 'angularfire2/auth';
import { AppController } from '../app-controller';
import { UsersProvider } from '../users/users';

/*
  Generated class for the FirebaseLoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseLoginProvider {
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  constructor(
    private userModule : UsersProvider,
    private angularAuth: AngularFireAuth,
    private modalController: ModalController,
    public http: HttpClient) {
  }

  showRecaptcha(id: string) {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.recaptchaVerifier.render();
  }

  signInWithPhoneNumber(phoneNumber: number) {

    var promise = new Promise((resolve, reject) => {
      const appVerifier = this.recaptchaVerifier;
      const phoneNumberString = "+84" + phoneNumber;
      firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
        .then(confirmationResult => {
          resolve(confirmationResult);
        })
        .catch(function (error) {
          alert("SMS code not send")
        });
    });
    return promise;
  }

  signInWithEmailPassword(creditical: Users) {
    var promise = new Promise((resolve) => {
      this.angularAuth.auth.signInWithEmailAndPassword(creditical.email, creditical.password).then(() => {
        resolve(1);
      }).catch((err) => {
        AppController.getInstance().doCloseLoading();
        alert("Tài khoản không tồn tại")
        resolve(0);
      });
    });
    return promise;
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validatePassword(newPassword): boolean {
    var regularExpression = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!regularExpression.test(newPassword)) {
      AppController.getInstance().doShowToast("Minimum eight characters, at least one letter and one number", 2000, "bottom");
      return false;
    }
    return true;
  }

  creatUserWithEmailPassword(user: Users) {
    return new Promise((resolve, reject) => {
      this.angularAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then(() => {
        resolve(1);
      }).catch(()=>{
        AppController.getInstance().doCloseLoading();
        alert("Tài khoản đã tồn tại");
        resolve(0);
      })
    })
  }

}
