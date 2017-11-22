import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../app-config';
import { HttpService } from '../http-service';
import { Parks } from './class/parks';

import firebase from 'firebase'
/*
  Generated class for the IparkingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IparkingProvider {
  private mConfig: AppConfig;

  constructor(
    private mHttpService: HttpService,
    public http: HttpClient) {
    
    this.mConfig = new AppConfig();
  }
  getAppConfig() {
    return this.mConfig;
  }
  loadConfig() {
    return new Promise((resolve, reject) => {
      if (this.mConfig.hasData()) {
        resolve();
      } else {
        this.mHttpService.getHttp().request("assets/config/iparking.json").subscribe(
          data => {
            this.mConfig.onResponseConfig(data.json());
            resolve();
          }
        );
      }
    });
  }

  addParks(newParks: Parks){
    console.log(firebase.auth().currentUser);
    
    return new Promise((resolve,reject)=>{
      firebase.database().ref('/parks').child(newParks.parkID).set({
        parkID : newParks.parkID,
        parkName : newParks.parkName,
        parksHotLine: newParks.parksHotLine,
        parkAddress : newParks.parkAddress,
        OwnerID : newParks.OwnerID,
        isOpen : newParks.isOpen,
        isValidate : newParks.isValidate,
        rate : newParks.rate,
        repairID : newParks.repairID,
        washID : newParks.washID,
        yardID : newParks.yardID,
        hotelID : newParks.hotelID,
        ILatLng : newParks.ILatLng
      }).then(()=>{
        resolve(1);
      }).catch((err)=>{
        alert(err);
        resolve(0);
      })
    })
  }

  getAllParks(){
    return new Promise((resolve,reject)=>{
      firebase.database().ref('/parks').once('value',(snapshot)=>{
        if(snapshot){
          let data = snapshot.val();
          let temp = [];
          for (const key in data) {
            temp.push(new Parks(data[key]));              
          }
          resolve(temp);
        }
      }).catch((err)=>{
        alert(err);
        resolve(0);
      })
    })
  }
  compare2Date(a: Date, b: Date): number{
    if(a.getDate() == b.getDate() && a.getMonth() == b.getMonth() && a.getFullYear()==b.getFullYear()){
      return 2;
    }
    if(a<b){
      return 1;
    }else{
      return 0;
    }
  }

}
