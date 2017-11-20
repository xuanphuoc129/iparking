import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupServicePage } from './signup-service';

@NgModule({
  declarations: [
    SignupServicePage,
  ],
  imports: [
    IonicPageModule.forChild(SignupServicePage),
  ],
})
export class SignupServicePageModule {}
