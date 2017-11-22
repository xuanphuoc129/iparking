import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';
import { FormWash } from '../form-wash/form-wash';
import { FormRepair } from '../form-repair/form-repair';
import { FormPark } from '../form-sign/form-sign';
import { FormHotel } from '../form-hotel/form-hotel';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { AppController } from '../../providers/app-controller';

/**
 * Generated class for the ListRequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-request',
  templateUrl: 'list-request.html',
})
export class ListRequestPage {
  wList = new Array<FormWash>();
  rList = new Array<FormRepair>();
  pList = new Array<FormPark>();
  hList = new Array<FormHotel>();

  constructor(
    public alertCtrl: AlertController,
    private requestModule: RequestsProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }
  objectValue = [];
  isLoading : boolean  =true;
  ionViewDidEnter() {
    this.requestModule.getAllRequest().then((res : any)=>{
      if(res){
        let data = res.val();
        for (const key in data) {
          if(data[key].typeRequest==1){
            this.hList.push(data[key]);
          }
          if(data[key].typeRequest==2){
            this.pList.push(data[key]);
          }
          if(data[key].typeRequest==3){
            this.rList.push(data[key]);
          }
          if(data[key].typeRequest==4){
            this.wList.push(data[key]);
          }
        }
        this.isLoading = false;
      }
    })
  }

  showConfirm(request,key,index) {
    let confirm = this.alertCtrl.create({
      title: 'Xác nhận hủy đăng ký',
      message: 'Bạn muốn hủy yêu cầu tới nhà dịch vụ?',
      buttons: [
        {
          text: 'Không',
          handler: () => {
            console.log('Disagree clicked');
            this.navCtrl.pop();
          }
        },
        {
          text: 'Đồng ý',
          handler: () => {
            AppController.getInstance().doShowLoading(99999999999);
            this.requestModule.removeRequest(request).then((res)=>{
              if(res){
                if(key==1){
                  this.wList.splice(index,1);
                }
                if(key==2){
                  this.rList.splice(index,1);
                }
                if(key==3){
                  this.pList.splice(index,1);
                }
                if(key==4){
                  this.hList.splice(index,1);
                }
                AppController.getInstance().doCloseLoading();
              }
            })
          }
        }
      ]
    });
    // this.park.parksHotLine
    confirm.present();
  }

}
