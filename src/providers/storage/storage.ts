import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
/*
  Generated class for the StorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageProvider {

  constructor(
    private storage: Storage,
    public http: HttpClient) {
    console.log('Hello StorageProvider Provider');
  }
  setLogin(value : number){
    this.storage.set("isLogin",value);
  }

  isLogIn(){
    return new Promise((resolve,reject)=>{
      this.storage.get("isLogin").then((val)=>{
        if(val && val==1){
          resolve(1);
        }else{
          resolve(0);
        }
      })
    })
  }
}
