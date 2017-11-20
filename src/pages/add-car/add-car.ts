import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, TextInput, ViewController } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { Cars } from '../../providers/iparking/class/car';

/**
 * Generated class for the AddCarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-car',
  templateUrl: 'add-car.html',
})
export class AddCarPage {
  @ViewChild("input1") input1: TextInput;
  @ViewChild("input2") input2: TextInput;
  car: Cars;
  constructor(
    private userModule: UsersProvider,
    private viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.car = new Cars();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCarPage');
    this.input1.setFocus();
  }
  change() {
    console.log("input");

    if (this.input1.value.length == 4) {
      this.input2.setFocus();
    }
  }
  getValue() : boolean{
    if(this.input1.value.length>3 && this.input2.value.length>4){
      this.car.carID = this.input1.value + '-' + this.input2.value;
    }else{
      return false;
    }
    if(this.isActive){
      this.car.carType = "0";
    }else{
      this.car.carType = "1";
    }
    this.car.carSeat = this.testRadioResult+"";
    return true;
  }
  closeView() {
    let check = this.getValue();
    if(check){
      this.userModule.addCars(this.car).then((res: any)=>{
        if(res.sucess){
          alert("Thêm xe thành công!");
        }else{
          this.viewCtrl.dismiss();
        }
      })
    }
    this.viewCtrl.dismiss();
  }
  testRadioOpen: boolean = false;
  testRadioResult: number = 4;
  seats: boolean[] = [true, false, false, false];
  showRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Số chỗ');

    alert.addInput({
      type: 'radio',
      label: '4 chỗ',
      value: '4',
      checked: this.seats[0],
      handler: () => {
        this.seats[0] = true;
        for (let i = 0; i < 4; i++) {
          if (i != 0) {
            this.seats[i] = false;
          }
        }
      }
    });
    alert.addInput({
      type: 'radio',
      label: '7 chỗ',
      value: '7',
      checked: this.seats[1],
      handler: () => {
        this.seats[1] = true;
        for (let i = 0; i < 4; i++) {
          if (i != 1) {
            this.seats[i] = false;
          }
        }
      }
    });
    alert.addInput({
      type: 'radio',
      label: '9 chỗ',
      value: '9',
      checked: this.seats[2],
      handler: () => {
        this.seats[2] = true;
        for (let i = 0; i < 4; i++) {
          if (i != 2) {
            this.seats[i] = false;
          }
        }
      }
    });
    alert.addInput({
      type: 'radio',
      label: '16 chỗ',
      value: '16',
      checked: this.seats[3],
      handler: () => {
        this.seats[3] = true;
        for (let i = 0; i < 4; i++) {
          if (i != 3) {
            this.seats[i] = false;
          }
        }
      }
    });
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.testRadioOpen = false;
        this.testRadioResult = data;
      }
    });
    alert.present();
  }
  isActive: boolean = true;
  active() {
    this.isActive = !this.isActive;
  }


}
