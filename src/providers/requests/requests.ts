import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormHotel } from '../../pages/form-hotel/form-hotel';

import firebase from 'firebase';
import { FormPark } from '../../pages/form-sign/form-sign';
import { FormRepair } from '../../pages/form-repair/form-repair';
import { FormWash } from '../../pages/form-wash/form-wash';
import { AppController } from '../app-controller';

/*
  Generated class for the RequestsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RequestsProvider {
  public firedata = firebase.database().ref("/requests");
  constructor(public http: HttpClient) {
    console.log('Hello RequestsProvider Provider');
  }

  requestHotel(hotel: FormHotel) {
    var key = firebase.database().ref().push().key;
    
    return new Promise((resolve, reject) => {
      this.firedata.child(firebase.auth().currentUser.uid).child(key).set({
        key: key,
        userID: firebase.auth().currentUser.uid,
        hotelID: hotel.hotelID,
        numberRoom: hotel.numberRoom,
        typeRoom: hotel.typeRoom,
        timeStarts: hotel.timeStarts,
        timeEnds: hotel.timeEnds,
        typePay: hotel.typePay,
        ownerID: hotel.ownerID,
        typeRequest: '1',
        MH: hotel.MH,
        timeStamp: new Date().toDateString()
      }).then(() => {
        this.firedata.child(hotel.ownerID).child(key).set({
          userID: firebase.auth().currentUser.uid,
          hotelID: hotel.hotelID,
          numberRoom: hotel.numberRoom,
          typeRoom: hotel.typeRoom,
          timeStarts: hotel.timeStarts,
          timeEnds: hotel.timeEnds,
          typePay: hotel.typePay,
          ownerID: hotel.ownerID,
          typeRequest: '1',
          MH: hotel.MH,
          timeStamp: new Date().toDateString()
        }).then(() => {
          resolve(1);
        })
      })
    });
  }

  requestPark(park: FormPark) {
    var key = firebase.database().ref().push().key;
    
    return new Promise((resolve, reject) => {
      this.firedata.child(firebase.auth().currentUser.uid).child(key).set({
        key: key,
        dateStart: park.dateStart,
        timeStarts: park.timeStarts,
        dateEnd: park.dateEnd,
        timeEnds: park.timeEnds,
        OwnerID: park.OwnerID,
        price: park.price,
        typePay: park.typePay,
        pid: park.pid,
        userID: firebase.auth().currentUser.uid,
        MH: park.MH,
        typeRequest: '2',
        timeStamp: new Date().toDateString()
      }).then(() => {
        this.firedata.child(park.OwnerID).child(key).set({
          key: key,
          dateStart: park.dateStart,
          timeStarts: park.timeStarts,
          dateEnd: park.dateEnd,
          timeEnds: park.timeEnds,
          OwnerID: park.OwnerID,
          price: park.price,
          pid: park.pid,
          typePay: park.typePay,
          userID: firebase.auth().currentUser.uid,
          MH: park.MH,
          typeRequest: '2',
          timeStamp: new Date().toDateString()

        }).then(() => {
          resolve(1);
        })
      })
    });
  }

  requestRepair(repair: FormRepair) {
    var key = firebase.database().ref().push().key;
    
    return new Promise((resolve, reject) => {
      this.firedata.child(firebase.auth().currentUser.uid).child(key).set({
        key: key,
        dateStarts: repair.dateStarts,
        timeStarts: repair.timeStarts,
        typePay: repair.typePay,
        carID: repair.carID,
        repairID: repair.repairID,
        OwnerID: repair.OwnerID,
        userID: firebase.auth().currentUser.uid,
        MH: repair.MH,
        typeRequest: '3',
        timeStamp: new Date().toDateString()
      }).then(() => {
        this.firedata.child(repair.OwnerID).child(key).set({
          key: key,
          dateStarts: repair.dateStarts,
          timeStarts: repair.timeStarts,
          typePay: repair.typePay,
          carID: repair.carID,
          repairID: repair.repairID,
          OwnerID: repair.OwnerID,
          userID: firebase.auth().currentUser.uid,
          MH: repair.MH,
          typeRequest: '3',
          timeStamp: new Date().toDateString()
        }).then(() => {
          resolve(1);
        })
      })
    });
  }

  requestWash(wash: FormWash) {
    var key = firebase.database().ref().push().key;
    return new Promise((resolve, reject) => {
      this.firedata.child(firebase.auth().currentUser.uid).child(key).set({
        key: key,
        dateStarts: wash.dateStarts,
        timeStarts: wash.timeStarts,
        typePay: wash.typePay,
        carID: wash.carID,
        price: wash.price,
        washID: wash.washID,
        OwnerID: wash.OwnerID,
        userID: firebase.auth().currentUser.uid,
        MH: wash.MH,
        typeRequest: '4',
        timeStamp: new Date().toDateString()
      }).then(() => {
        this.firedata.child(wash.OwnerID).child(key).set({
          key: key,
          dateStarts: wash.dateStarts,
          timeStarts: wash.timeStarts,
          typePay: wash.typePay,
          carID: wash.carID,
          price: wash.price,
          washID: wash.washID,
          OwnerID: wash.OwnerID,
          userID: firebase.auth().currentUser.uid,
          MH: wash.MH,
          typeRequest: '4',
          timeStamp: new Date().toDateString()
        }).then(() => {
          resolve(1);
        })
      })
    });
  }

  getAllRequest() {
    return new Promise((resolve, reject) => {
      this.firedata.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
        if (snapshot) {
          resolve(snapshot);
        } else {
          resolve(0);
        }
      }).catch((err) => {
        alert(err);
        resolve(0);
      })
    })
  }

  removeRequest(request){
    return new Promise((resolve,reject)=>{
      this.firedata.child(firebase.auth().currentUser.uid).child(request.key).remove().then(()=>{
        this.firedata.child(request.OwnerID).child(request.key).remove(()=>{
          AppController.getInstance().doShowToast("Hủy thành công!",2000,"middle");
          resolve(1);
        }).catch((err)=>{
          alert(err);
          resolve(0);
        })
      }).catch((err)=>{
        alert(err);
        resolve(0);
      })
    })
  }
}
