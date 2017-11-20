import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Users } from './user';

import firebase from 'firebase';
import { Cars } from '../iparking/class/car';
/*
  Generated class for the UsersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsersProvider {

  constructor(
    private afa: AngularFireAuth,
    public http: HttpClient) {
    console.log('Hello UsersProvider Provider');
  }

  addUser(newuser: Users) {
    return new Promise((resolve, reject) => {
      firebase.database().ref('/users').child(this.afa.auth.currentUser.uid).set({
        uid: newuser.uid,
        displayName: newuser.displayName,
        photoURL: newuser.photoURL,
        phoneNumber: newuser.phoneNumber,
        email: newuser.email,
        address: newuser.address,
        date: newuser.date,
        providerId: newuser.providerId
      }).then(() => {
        resolve(1);
      }).catch((err) => {
        resolve(0);
      })
    });
  }

  getUserDetail() {
    var promise = new Promise((resolve) => {
      firebase.database().ref('/users/' + firebase.auth().currentUser.uid).once('value', (snapshot) => {
        resolve(new Users(snapshot.val()));
      }).catch((err) => {
        alert(err);
      })
    })
    return promise;
  }
  addCars(car : Cars) {
    return new Promise((resolve,reject)=>{
      firebase.database().ref("/cars").child(firebase.auth().currentUser.uid).push({
        carID: car.carID,
        carType: car.carType,
        carSeat: car.carSeat
      }).then(()=>{
        resolve({sucess: true});
      })
    });
  }

  getCars(){
    let cars = new Array<Cars>();
    let data = [];
    return new Promise((resolve,reject)=>{
      firebase.database().ref("/cars").child(firebase.auth().currentUser.uid).once("value",(snapshot)=>{
        data = snapshot.val();
        for (const key in data) {
          cars.push(new Cars(data[key]));
        } 
        resolve(cars);
      }).catch((err)=>{
        resolve(false);
      })
    });
  }

  updateInfo(user : Users){
    return new Promise((resolve,reject)=>{
      firebase.database().ref("/users").child(firebase.auth().currentUser.uid).update(user).then(()=>{
        resolve(1);
      }).catch((err)=>{
        resolve(0);
      })
    })
  }

  addfavorite(parkID: string, isFavorite: boolean) {
    var value: number = 0;
    if(isFavorite){
      value =  1;
    }
    firebase.database().ref("/rates").child(firebase.auth().currentUser.uid).child(parkID).update({
      parkID: parkID,
      isFavorite: value
    }, (err) => {
      firebase.database().ref("/rates").child(firebase.auth().currentUser.uid).child(parkID).set({
        parkID: parkID,
        isFavorite: value
      }).catch((err) => {
        alert("error!");
      })
    }).catch((err) => {
      alert("error!");
    })
  }

  getAllFavorite(){
    return new Promise((resolve,reject)=>{
      firebase.database().ref("/rates").child(firebase.auth().currentUser.uid).once("value",(snapshot)=>{
        if(snapshot){
          let data = snapshot.val();
          let temp = [];
          for (const key in data) {
            if(data[key].isFavorite > 0){
              temp.push(data[key].parkID);
            }
          } 
          resolve(temp);
        }
      }).catch((err)=>{
        resolve(false);
      })
    });
  }

  getFavorite(parkID: string){
    return new Promise((resolve,reject)=>{
      
      firebase.database().ref("/rates").child(firebase.auth().currentUser.uid).child(parkID).once('value',(snapshot)=>{
        if(snapshot.val()){
          resolve(snapshot.val().isFavorite);
        }
      }).catch((err)=>{
        resolve(false);
      })
    })
  }

}
