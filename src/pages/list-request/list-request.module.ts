import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListRequestPage } from './list-request';

@NgModule({
  declarations: [
    ListRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(ListRequestPage),
  ],
})
export class ListRequestPageModule {}
