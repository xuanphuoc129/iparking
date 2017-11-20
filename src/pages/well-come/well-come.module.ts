import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WellComePage } from './well-come';

@NgModule({
  declarations: [
    WellComePage,
  ],
  imports: [
    IonicPageModule.forChild(WellComePage),
  ],
})
export class WellComePageModule {}
