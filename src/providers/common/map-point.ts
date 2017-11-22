export class MapPoint {
    lat: number = 0;
    lng: number = 0;

    constructor() {

    }

    isValid() {
        return this.lat != 0 && this.lng != 0;
    }
    set(lat: number, lng: number) {
        this.lat = lat;
        this.lng = lng;
    }

    getDistanceInKm(lat: number, lng: number): number {
        return this.calculateDistance(this.lat, this.lng, lat, lng);
    }

    getDistanceMapPoint(point: MapPoint): number {
        return this.calculateDistance(this.lat, this.lng, point.lat, point.lng);
    }
    calculateDistance(lat1, lng1, lat2, lng2) {
        let dLat = this.degreeToRadian(lat2 - lat1);
        let dLng = this.degreeToRadian(lng2 - lng1);
        let tlat1 = this.degreeToRadian(lat1);
        let tlat2 = this.degreeToRadian(lat2);

        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(tlat1) * Math.cos(tlat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return (6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }

    degreeToRadian(value) {
        return value * Math.PI / 180;
    }
}