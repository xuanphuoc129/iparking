import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormHotelPage } from './form-hotel';

@NgModule({
  declarations: [
    FormHotelPage,
  ],
  imports: [
    IonicPageModule.forChild(FormHotelPage),
  ],
})
export class FormHotelPageModule {}
