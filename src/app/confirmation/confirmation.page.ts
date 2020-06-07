import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/service/BookingServiceProvider';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {
  fare: string;
  distance: string;
  bookingId: string;
  pickupDateTime: string
  timeTaken: string;

  constructor(private _location: Location, private bookingService: BookingService, private http: HttpClient, private router: Router) { }


  ngOnInit() {
    const bookingDetails = this.bookingService.getBookingDetails() ? JSON.parse(this.bookingService.getBookingDetails()) : {};
    this.bookingId = bookingDetails.booking_id;
    this.fare = bookingDetails.fare;
    this.distance = bookingDetails.distance;
    this.timeTaken = bookingDetails.time;
    this.pickupDateTime = bookingDetails.pickup_datetime;
  }

  async confirmBooking() {
    await this.http.get(`${environment.serverUrl}/confirm_booking`, {
      responseType: "text", params: {
        booking_id: this.bookingId,
        fcm_token: this.bookingService.getToken()
      }
    },
    ).toPromise().then(this.resetBooking.bind(this)).catch(error => {
      console.log("failed", error)
    });
  }

  async cancelBooking() {
    await this.http.get(`${environment.serverUrl}/cancel_booking`, {
      responseType: "text", params: {
        booking_id: this.bookingId
      }
    },
    ).toPromise().then(this.resetBooking.bind(this)).catch(error => {
      console.log("failed", error)
    });
  }

  resetBooking() {
    this.bookingService.resetBookingDetails();
    this._location.back();
  }
}
