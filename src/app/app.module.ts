import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler,NavController } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import firebase from 'firebase';
import { FirebaseLoginProvider } from '../providers/firebase-login/firebase-login';

import {GoogleMaps} from '@ionic-native/google-maps';


import {HttpClientModule} from '@angular/common/http';
import { UsersProvider } from '../providers/users/users';
import { GoogleMapProvider } from '../providers/google-map/google-map';
import { Geolocation } from '@ionic-native/geolocation';
import { IparkingProvider } from '../providers/iparking/iparking';
import { HttpService } from '../providers/http-service';
import { HttpModule } from '@angular/http';
import { StorageProvider} from '../providers/storage/storage';

import { IonicStorageModule } from '@ionic/storage';
import { MapJsProvider } from '../providers/map-js/map-js';
export const firebaseConfig = {
  apiKey: "AIzaSyBhwRfLRKPd2FhSwIwGFet2VAMvWKcyhMg",
  authDomain: "iparking-8b618.firebaseapp.com",
  databaseURL: "https://iparking-8b618.firebaseio.com",
  projectId: "iparking-8b618",
  storageBucket: "",
  messagingSenderId: "877922892598"
};
firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseLoginProvider,
    UsersProvider,
    GoogleMaps,
    Geolocation,
    GoogleMapProvider,
    IparkingProvider,
    HttpService,
    StorageProvider,
    MapJsProvider,
  ]
})
export class AppModule {}
