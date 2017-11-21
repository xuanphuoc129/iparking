import { Component, ViewChild } from '@angular/core';
import { Platform,Nav} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';

export interface MenuItemsInterface{
  icon : string;
  name : string;
  component : string;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = "IparkLoadingPage";
  menuItems :  MenuItemsInterface[] = [
    {
    icon: "list-box",
    name: "Lịch sử",
    component: ""
    },
    {
      icon: "list",
      name: "Danh sách dịch vụ đang chờ ",
      component: ""
    },
    {icon: "car",name: "Thêm xe", component: "AddCarPage"},
    {
      icon: "card",
      name: "Thẻ thanh toán",
      component: ""
    },
    {
      icon: "star",
      name: "Yêu thích",
      component: ""
    },
    {icon:"notifications",name: "Thông báo", component: ""},
    {icon:"help", name: "Trợ giúp", component:""},
    {icon:"information-circle", name: "Thông tin ứng dụng", component:""},
    {icon: "pin",name:"Trở thành Owner",component:""},
    {icon: "person",name:"Tài khoản",component:"ProfilePage"},
  ];
  constructor(
    platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  openPage(item){
    if(item.component){
      this.nav.push(item.component);
    }
  }
}
