
import firebase from 'firebase';

export class Users{
    displayName: string;
    email: string ;
    phoneNumber: string;
    photoURL: string;
    providerId: string;
    uid: string;
    address: string;
    date : string;
    password: string;

    constructor(user?: any){
        this.uid = "";
        this.photoURL = "";
        this.phoneNumber = "";
        this.address = "";
        this.date = "";
        this.displayName = "";
        this.providerId = "";
        this.email = "";
        this.password = "";
        if(user){
            this.pair(user);
        }
    }

    pair(user: any){
        if(user.uid)this.uid = user.uid;
        if(user.photoURL)this.photoURL = user.photoURL;
        if(user.phoneNumber)this.phoneNumber = user.phoneNumber;
        if(user.address)this.address = user.address;
        if(user.date)this.date = user.date;
        if(user.displayName)this.displayName = user.displayName;
        if(user.email)this.email = user.email;
        if(user.providerId)this.providerId = user.providerId;
    }

    setDate(date : string){
        this.date = date;
    }
    setDisplayName(fullname: string){
        this.displayName = fullname;
    }   

    

    
}