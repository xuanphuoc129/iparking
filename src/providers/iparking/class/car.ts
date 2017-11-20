export class Cars{
    carID: string;
    carType: string;
    carSeat: string;
    constructor(opts?:any){
        this.carID = "30A1-12345";
        this.carType = "0";
        this.carSeat = "4";
        if(opts){
            this.pair(opts);
        }
    }
    pair(opts: any){
        if(opts.carID) this.carID = opts.carID;
        if(opts.carType) this.carType = opts.carType;
        if(opts.carSeat) this.carSeat = opts.carSeat;
    }
}