
export class Parks{
    parkID: string;
    parkName: string;
    OwnerID: string;
    parkAddress: string;
    ILatLng: any;
    washID: string;
    repairID: string;
    yardID: string;
    hotelID: string;
    parksHotLine: string;
    rate: number;
    isOpen : boolean;
    isValidate: boolean;
    distance: string;
    constructor(opts?: any){
        this.parkID = "M00";
        this.parkName = "TNHH Lorem";
        this.OwnerID = "Owner00";
        this.parkAddress = "0 street City";
        this.ILatLng = {lat: 0.0, lng: 0.0};
        this.washID = "W00";
        this.repairID = "R00";
        this.yardID = "Y00";
        this.hotelID = "H00";
        this.parksHotLine = "123456789";
        this.rate =  0.0;
        this.isOpen = false;
        this.isValidate = false;
        this.distance = "0";
        if(opts){
            this.pair(opts);
        }
    }
    setDistance(distance: string){
        this.distance = distance;
    }
    pair(opts : any){
        if(opts.parkID) this.parkID = opts.parkID;
        if(opts.parkName) this.parkName = opts.parkName;
        if(opts.parksHotLine) this.parksHotLine= opts.parksHotLine;
        if(opts.parkAddress) this.parkAddress = opts.parkAddress;
        if(opts.OwnerID) this.OwnerID = opts.OwnerID;
        if(opts.isOpen) this.isOpen = opts.isOpen;
        if(opts.isValidate) this.isValidate = opts.isValidate;
        if(opts.rate) this.rate = opts.rate;
        if(opts.repairID) this.repairID = opts.repairID;
        if(opts.washID) this.washID = opts.washID;
        if(opts.yardID) this.yardID = opts.yardID;
        if(opts.hotelID) this.hotelID = opts.hotelID;
        if(opts.ILatLng) this.ILatLng = opts.ILatLng;
    }
    setParkID(parkID : string){
        this.parkID = parkID;
    }

    setILatlng(latLng: any){
        this.ILatLng = latLng;
    }

    setAddress(address: string){
        this.parkAddress = address;
    }

    setHotLine(hotline: string){
        this.parksHotLine = hotline;
    }

    setOwnerID(ownerId : string){
        this.OwnerID = ownerId;
    }
}