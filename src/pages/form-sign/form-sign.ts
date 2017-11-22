import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Parks } from '../../providers/iparking/class/parks';
import { Cars } from '../../providers/iparking/class/car';
import { UsersProvider } from '../../providers/users/users';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { IparkingProvider } from '../../providers/iparking/iparking';
import { RequestsProvider } from '../../providers/requests/requests';
import { AppController } from '../../providers/app-controller';

/**
 * Generated class for the FormSignPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface FormPark {
  userID: string;
  OwnerID: string;
  timeStarts: string;
  timeEnds: string;
  dateStart: string;
  dateEnd: string;
  price: string;
  typePay: string;
  pid: string;
  MH: string;
  carID: string;
}

@IonicPage()
@Component({
  selector: 'page-form-sign',
  templateUrl: 'form-sign.html',
})
export class FormSignPage {
  park: Parks;
  cars = new Array<Cars>();
  event : FormPark;
  constructor(
    private requestModule: RequestsProvider,

    private mAppModule: IparkingProvider,
    private alertCtrl: AlertController,
    private modal: ModalController,
    private userModule: UsersProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.park = new Parks();
    let date = new Date();
    if (this.navParams.get('park')) {
      this.park = this.navParams.get('park');
    }
    this.event = {
      dateStart: '2017-11-21',
      timeStarts: '00:10',
      dateEnd: '2017-11-21',
      timeEnds: '00:20',
      OwnerID: 'oid',
      price: '15000',
      typePay: '1',
      userID: '',
      pid: 'pid',
      carID: '',
      MH: this.park.parkID
    }
    this.event.dateStart = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    this.event.dateEnd = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    if (date.getHours() < 10) {
      this.event.timeStarts = '0' + date.getHours() + ':' + date.getMinutes();
      this.event.timeEnds = '0' + date.getHours() + ':' + date.getMinutes();
    } else {
      this.event.timeStarts = date.getHours() + ':' + date.getMinutes();
      this.event.timeEnds = date.getHours() + ':' + date.getMinutes();
    }
    console.log(this.event);
  }
 
  carID: string = "";
  ionViewDidEnter() {
    
    this.getCars();
  }

  comparegetHours(){
    setTimeout(() => {
    var timeStart = new Date(this.event.dateStart);
    timeStart.setHours(parseInt(this.event.timeStarts.split(":")[0]), parseInt(this.event.timeStarts.split(":")[1]));

    var timeEnd = new Date(this.event.dateEnd);
    timeEnd.setHours(parseInt(this.event.timeEnds.split(":")[0]), parseInt(this.event.timeEnds.split(":")[1]));
    let number = this.mAppModule.compare2Date(timeStart, timeEnd);
    if (number > 0) {
        var diff = (timeEnd.getTime() - timeStart.getTime()) / 1000;
        diff /= (60 * 60);
        console.log(Math.abs(Math.round(diff)));

        if (Math.abs(Math.round(diff)) > 0) {
          this.event.price = 15000 * Math.abs(Math.round(diff)) + '';
        } else {
          this.event.price = '15000';
        }
    } else {
      alert("Ngày kết thúc phải lớn hơn ngày bắt đầu");
    }
  }, 1000);

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
    this.comparegetHours();
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
            this.requestModule.requestPark(this.event).then((res: any) => {
              if (res) {
                AppController.getInstance().doCloseLoading();
                AppController.getInstance().doShowToast("Đăng ký thành công!",3000,"top");
                this.navCtrl.pop();
              } else {
                AppController.getInstance().doShowToast("Không thể gửi yêu cầu tới nhà cung cấp dịch vụ", 2000, "bottom");
              }
            })
          }
        }

      ]
    });
    alert.present();
  }
}
