import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Slides, ModalController, AlertController } from 'ionic-angular';
import { Parks } from '../../providers/iparking/class/parks';
import { HomePage } from '../home/home';
import { UsersProvider } from '../../providers/users/users';
import { Cars } from '../../providers/iparking/class/car';

/**
 * Generated class for the SignupServicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup-service',
  templateUrl: 'signup-service.html',
})
export class SignupServicePage {
  park : Parks;
  cars = new Array<Cars>();
  constructor(
    private userModule :UsersProvider,
    public alertCtrl: AlertController,
    private modal: ModalController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.park = new Parks();
    this.carID = "Trống"
  }
  carID: string = "";
  ionViewDidEnter() {
    this.userModule.getCars().then((res: any)=>{
      if(res){
        this.cars = res;
        this.carID = this.cars[0].carID;
      }else{
        console.log("empty");
      }
    }).catch((err)=>{

    })
    console.log('ionViewDidLoad SignupServicePage');
  }
  closeView(){
    if(this.navCtrl.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.navCtrl.setRoot(HomePage);
    }
  }
  getCars(){
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
        this.testRadioOpen = false;
        this.carID = data;
      }
    });
    alert.present();
  }

  addCar(){
    let modal = this.modal.create("AddCarPage");
    modal.present();
  }
  testRadioOpen: boolean = false;
  testRadioResult : number = 1;
  seats : boolean[] = [true,false,false,false];
  showRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Chọn giờ');

    for(let i = 0 ; i < this.seats.length; i++){
      alert.addInput({
        type: 'radio',
        label: (i+1)+'giờ',
        value: ''+(i+1),
        checked: this.seats[i], 
        handler: ()=>{
          this.seats[i] = true;
          for(let j = 0; j< 4; j++){
            if(j!=i){
              this.seats[j]= false;
            }
          }
        }
      });
    }
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
  GotoSignPark(){
    this.navCtrl.push("FormSignPage");
  }
}
