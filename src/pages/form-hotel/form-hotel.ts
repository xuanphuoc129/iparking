import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Cars } from '../../providers/iparking/class/car';
import { Parks } from '../../providers/iparking/class/parks';
import { UsersProvider } from '../../providers/users/users';
import firebase from 'firebase';
import { DateTime } from 'ionic-angular/components/datetime/datetime';
import { RequestsProvider } from '../../providers/requests/requests';
import { AppController } from '../../providers/app-controller';
/**
 * Generated class for the FormHotelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface FormHotel{
  userID: string;
  hotelID: string;
  timeStarts: string;
  timeEnds: string;
  numberRoom: string;
  typeRoom: string;
  typePay: string;
  ownerID: string;
  MH: string;
}

@IonicPage()
@Component({
  selector: 'page-form-hotel',
  templateUrl: 'form-hotel.html',
})
export class FormHotelPage {
  park: Parks;
  cars = new Array<Cars>();
  event: FormHotel;
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
      userID: 'uid',
      hotelID: 'HID',
      numberRoom: '1',
      typeRoom: '250000',
      timeStarts: '2017-11-21',
      timeEnds: '2017-11-21',
      typePay: '1',
      ownerID: 'OID',
      MH: this.park.parkID
    }
    this.event.timeStarts = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    this.event.timeEnds = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    
    console.log(this.event);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormHotelPage');
  }
  
  carID: string = "";
  ionViewDidEnter() {
   
    this.getCars();
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
    let number = this.compare2Date(new Date(this.event.timeStarts), new Date(this.event.timeEnds));
    
    if(number > 0){
      this.showConfirm();
    }else{
      alert("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu");
    }
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
            
            this.requestModule.requestHotel(this.event).then((res: any)=>{
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
  public AlertOptions = {
    title: 'Số lượng phòng',
    message: "Nhập số phòng bạn muốn đăng ký",
    inputs: [
      {
        name: 'number',
        placeholder: 'Number'
      },
    ],
    buttons: [
      {
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Save',
        handler: data => {
          console.log('Saved clicked',data.number);
          if(parseInt(data.number)>0){
            this.event.numberRoom = data.number;
          }
        }
      }
    ]
  }
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Số lượng phòng',
      message: "Nhập số phòng bạn muốn đăng ký",
      inputs: [
        {
          name: 'number',
          placeholder: 'Number'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked',data.number);
            if(parseInt(data.number)>0){
              this.event.numberRoom = data.number;
            }
          }
        }
      ]
    });
    prompt.present();
  }
}
