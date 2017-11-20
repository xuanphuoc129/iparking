import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IparkLoadingPage } from './ipark-loading';

@NgModule({
  declarations: [
    IparkLoadingPage,
  ],
  imports: [
    IonicPageModule.forChild(IparkLoadingPage),
  ],
})
export class IparkLoadingPageModule {}
