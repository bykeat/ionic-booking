import { Injectable } from "@angular/core"

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private bookingDetails: any; // of course replace any with a nice interface of your own
    private token: string = "";
    public setBookingDetails(param) {
        this.bookingDetails = param;
    }

    public setToken(token) {
        this.token = token;
    }

    public getToken() {
        return this.token;
    }

    public getBookingDetails() {
        return this.bookingDetails;
    }

    public resetBookingDetails() {
        this.bookingDetails = null;
    }
}