import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Parks } from '../../providers/iparking/class/parks';
import { Cars } from '../../providers/iparking/class/car';
import { UsersProvider } from '../../providers/users/users';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

/**
 * Generated class for the FormSignPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-form-sign',
  templateUrl: 'form-sign.html',
})
export class FormSignPage {
  park : Parks;
  cars = new Array<Cars>();
  constructor(
    private alertCtrl : AlertController,
    private modal: ModalController,
    private userModule: UsersProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.park = new Parks();
  }
  public event = {
    month: '2017-11-21',
    timeStarts: '00:00',
    timeEnds: '2017-11-21'
  }
  carID : string = "";
  ionViewDidEnter() {
    this.getCars();
  }

  getCars(){
    this.userModule.getCars().then((res: any)=>{
      if(res){
        this.cars = res;
        this.carID = this.cars[0].carID;
      }else{
        console.log("empty");
      }
    }).catch((err)=>{})
  }
  addCar(){
    let modal = this.modal.create("AddCarPage");
    modal.onDidDismiss(()=>{
      this.getCars();
    })
    modal.present();
  }

  getCarsList(){
    if(this.cars.length>0){
      this.showCarsList();
    }
  }
  selectedCar : boolean[] = [];
  showCarsList(){
    for(let k = 0; k< this.cars.length; k++){
      if(k!=0){
        this.selectedCar.push(false);
      }else{
        this.selectedCar.push(true);
      }
    }
    let alert = this.alertCtrl.create();
    alert.setTitle('Chọn xe');
    for(let i = 0; i < this.cars.length; i++){

      alert.addInput({
        type: 'radio',
        label: this.cars[i].carID,
        checked: this.selectedCar[i], 
        value: this.cars[i].carID,
        handler: ()=>{
          this.selectedCar[i] = true;
          for(let j = 0; j< this.cars.length; j++){
            if(j!=i && this.selectedCar[j]){
              this.selectedCar[j]= false;
            }
          }
        }
      });
    }
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.carID = data;
      }
    });
    alert.present();
  }
  sign(){
    this.showConfirm();
  }
  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Xác nhận đăng ký dịch vụ',
      message: 'Bạn muốn gửi yêu cầu tới nhà dịch vụ?',
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
            // console.log('Agree clicked');
            this.showAlert();
          }
        }
      ]
    });
    // this.park.parksHotLine
    confirm.present();
  }
  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Thông báo đăng ký',
      subTitle: 'Chúng tôi đã gửi yêu cầu của bạn đến nhà cung cấp dịch vụ',
      buttons: [
       {
         text: 'OK',
         handler: ()=>{
           this.navCtrl.pop();
         }
       }
        
      ]
    });
    alert.present();
  }
}
