import { Injectable } from "@angular/core"

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private bookingDetails: any; // of course replace any with a nice interface of your own

    public setBookingDetails(param) {
        this.bookingDetails = param;
    }

    public getBookingDetails() {
        return this.bookingDetails;
    }

    public resetBookingDetails() {
        this.bookingDetails = null;
    }
}