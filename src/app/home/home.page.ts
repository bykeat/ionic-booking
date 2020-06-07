
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "./../../environments/environment";
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from '@capacitor/core';
const { PushNotifications } = Plugins;

import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  LatLng,
} from '@ionic-native/google-maps';
import { google } from "google-maps";


import { BookingService } from 'src/service/BookingServiceProvider';
import { from } from 'rxjs';
declare var google: google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  minSelectionDate: string;
  pickupLocation: string = "";
  destination: string = "";
  passengerCount: number = 1;
  bookingType: string = "normal";
  pickupDateTime: number;
  bookingNote: string = "";
  pickupLatLng: LatLng;
  destinationLatLng: LatLng;
  pickupMarker: google.maps.Marker;
  destinationMarker: google.maps.Marker;
  private map;


  constructor(
    public alertController: AlertController,
    private http: HttpClient,
    private geolocation: Geolocation,
    private platform: Platform,
    private router: Router,
    private bookingService: BookingService
  ) {

  }

  async initNotification() {
    PushNotifications.requestPermission().then(result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        this.bookingService.setNotification(token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        //alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        //alert('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        //alert('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }

  async ngOnInit() {

    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    this.minSelectionDate = localISOTime;

    this.initNotification();

    await this.platform.ready();
    await this.getLocation();

  }



  async writeNote() {
    const leaveNote = await this.alertController.create({
      header: "Leave note",
      inputs: [
        {
          name: "message",
          type: "text",
        }
      ],
      buttons: [
        {
          text: "Confirm",
          handler: (e) => {
            this.bookingNote = e.message;
          },

        }, {
          text: "Cancel",
          role: "cancel"
        }
      ]
    });
    await leaveNote.present();
  }

  addPassenger() {
    if (this.passengerCount < 12)
      this.passengerCount++;
  }

  reducePassenger() {
    if (this.passengerCount > 1)
      this.passengerCount--;
  }

  setPickupTime() {
    document.getElementById("datetime").click();
  }

  loadMap(lat, lng) {
    this.pickupLatLng = new LatLng(lat, lng);
    this.map = new google.maps.Map(
      document.getElementById('map'), { zoom: 18, center: this.pickupLatLng, clickableIcons: false });

    if (this.pickupMarker) {
      this.pickupMarker.setMap(null);
    }
    this.pickupMarker = new google.maps.Marker({
      position: this.pickupLatLng
    });
    this.pickupMarker.setMap(this.map);

    var geocoder = new google.maps.Geocoder;
    this.geocodeLatLng(geocoder, this.pickupLatLng, this.map, this.updatePickupName.bind(this));
  }

  focusNewLocation() {
    this.setDestination();
  }

  setDestination() {
    var place = new google.maps.places.PlacesService(this.map);
    var request = { query: this.destination, fields: ["geometry"] };
    place.findPlaceFromQuery(request, this.updateDestinationData.bind(this));
  }

  updateDestinationData(results, status) {

    if (status === google.maps.places.PlacesServiceStatus.OK) {
      this.map.setCenter(results[0].geometry.location);

      this.destinationLatLng = new LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());

      if (this.destinationMarker) {
        this.destinationMarker.setMap(null);
      }
      this.destinationMarker = new google.maps.Marker({
        position: results[0].geometry.location,
      });
      this.destinationMarker.setMap(this.map);

      var geocoder = new google.maps.Geocoder;
      this.geocodeLatLng(geocoder, this.destinationLatLng, this.map, this.updateDestinationName.bind(this));
    }

  }

  updatePickupName(name) {
    this.pickupLocation = name;
  }
  updateDestinationName(name) {
    this.destination = name;
  }


  geocodeLatLng(geocoder, locationLatLng, map, callback) {
    geocoder.geocode({ 'location': locationLatLng }, function (results, status) {
      if (status === 'OK') {
        if (results[0]) {
          map.setZoom(17);
          callback(results[0].formatted_address)
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  getLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.loadMap(resp.coords.latitude,
        resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  validateInputs() {
    if (!this.destinationLatLng) {
      console.log("Destination not set.")
      return false;
    } else if (typeof this.destinationLatLng.lat === "function" || typeof this.destinationLatLng.lng === "function") {
      console.log("Destination unrecognized.")
      return false;
    }

    return true;
  }

  calculateFare() {
    // console.log("pickup", this.pickupLocation,
    //   this.pickupLatLng,
    //   "dest",
    //   this.destination,
    //   this.destinationLatLng,
    //   "passengers",
    //   this.passengerCount, "book type",
    //   this.bookingType, "pickup date",
    //   this.pickupDateTime, "note", this.bookingNote);

    if (!this.validateInputs()) {
      return;
    }

    this.http.get(`${environment.serverUrl}/make_booking`, {
      responseType: "text", params: {
        booking_type: this.bookingType,
        origin: `${this.pickupLatLng.lat},${this.pickupLatLng.lng}`,
        destination: `${this.destinationLatLng.lat},${this.destinationLatLng.lng}`,
        passengers: this.passengerCount.toString(),
        notes: this.bookingNote,
        pickup_time: this.pickupDateTime ? new Date(this.pickupDateTime).toISOString() : new Date().toISOString()
      }
    },
    ).toPromise().then(response => {
      this.bookingService.setBookingDetails(response);
      this.router.navigateByUrl("/home/confirmation");
    }).catch(error => {
      console.log("failed", error)
    });
    return;

  }
}