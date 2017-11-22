import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Parks } from '../../providers/iparking/class/parks';
import { Cars } from '../../providers/iparking/class/car';
import { UsersProvider } from '../../providers/users/users';
import { AppController } from '../../providers/app-controller';
import { RequestsProvider } from '../../providers/requests/requests';

/**
 * Generated class for the FormRepairPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface FormRepair{
  userID: string;
  carID: string;
  repairID: string;
  dateStarts: string;
  timeStarts: string;
  typePay : string;
  OwnerID: string;
  MH: string;
}
@IonicPage()
@Component({
  selector: 'page-form-repair',
  templateUrl: 'form-repair.html',
})
export class FormRepairPage {
  park: Parks;
  cars = new Array<Cars>();
  event: FormRepair;
  constructor(
    private requestModule :RequestsProvider,
    
    private alertCtrl: AlertController,
    private modal: ModalController,
    private userModule: UsersProvider,
    public navCtrl: NavController, public navParams: NavParams) {
      this.park = new Parks();
      let date = new Date();
      if(this.navParams.get('park')){
        this.park = this.navParams.get('park');
      }
      this.event= {
        dateStarts: '2017-11-21',
        timeStarts: '00:00',
        typePay: '1',
        carID: this.carID,
        userID: '',
        repairID: 'repairID',
        OwnerID: 'OID',
        MH: this.park.parkID
      }
      this.event.dateStarts = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
      if(date.getHours()<10){
      this.event.timeStarts = '0'+date.getHours()+':'+date.getMinutes();
      }else{
      this.event.timeStarts = date.getHours()+':'+date.getMinutes();
      }
      console.log(this.event);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormRepairPage');
  }
  carID: string = "";
  
 
  ionViewDidEnter() {
    
    this.getCars();
  }

  getCars() {
    this.userModule.getCars().then((res: any) => {
      if (res) {
        this.cars = res;
        this.carID = this.cars[0].carID;
      } else {
        console.log("empty");
      }
    }).catch((err) => { })
  }
  addCar() {
    let modal = this.modal.create("AddCarPage");
    modal.onDidDismiss(() => {
      this.getCars();
    })
    modal.present();
  }

  getCarsList() {
    if (this.cars.length > 0) {
      this.showCarsList();
    }
  }
  selectedCar: boolean[] = [];
  showCarsList() {
    for (let k = 0; k < this.cars.length; k++) {
      if (k != 0) {
        this.selectedCar.push(false);
      } else {
        this.selectedCar.push(true);
      }
    }
    let alert = this.alertCtrl.create();
    alert.setTitle('Chọn xe');
    for (let i = 0; i < this.cars.length; i++) {

      alert.addInput({
        type: 'radio',
        label: this.cars[i].carID,
        checked: this.selectedCar[i],
        value: this.cars[i].carID,
        handler: () => {
          this.selectedCar[i] = true;
          for (let j = 0; j < this.cars.length; j++) {
            if (j != i && this.selectedCar[j]) {
              this.selectedCar[j] = false;
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
  sign() {
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
          handler: () => {
            AppController.getInstance().doShowLoading(9999999999);
            this.event.carID = this.carID;
            this.requestModule.requestRepair(this.event).then((res: any)=>{
              if(res){
                AppController.getInstance().doCloseLoading();
                AppController.getInstance().doShowToast("Đăng ký thành công!",3000,"top");
                this.navCtrl.pop();
              }else{
                AppController.getInstance().doShowToast("Không thể gửi yêu cầu tới nhà cung cấp dịch vụ",2000,"bottom");
              }
            })
          }
        }

      ]
    });
    alert.present();
  }

}
