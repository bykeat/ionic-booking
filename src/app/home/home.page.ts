
import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
//import { HTTP } from '@ionic-native/http/ngx'; //android only
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment,
  LatLng,
  MarkerIcon
} from '@ionic-native/google-maps';
import { HttpClient, HttpParams } from "@angular/common/http";
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  str_pickup: string = "";
  str_destination: string = "";
  nm_passengers: number = 0;
  bl_preBook: string = "false";
  dt_pickup: number;
  str_note: string = "";
  timer: Timeout = null;
  ltlg_pickup: LatLng;
  ltlg_destination: LatLng;

  ui_markers: Marker;
  ui_marker_destination: Marker;

  private map;

  constructor(public alertController: AlertController, private http: HttpClient, private geolocation: Geolocation, private platform: Platform) {

  }
  async ngOnInit() {
    await this.platform.ready();
    await this.getLocation();

  }


  // async setPassengers() {
  //   const alert = await this.alertController.create({
  //     header: "How many going?",
  //     inputs: [
  //       {
  //         name: "passengers",
  //         type: "number",
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: "Set",
  //         handler: (e) => {
  //           nm_passengers = e.passengers;
  //         },

  //       }, {
  //         text: "Cancel",
  //         role: "cancel"
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }


  async showNote() {
    const alert = await this.alertController.create({
      header: "Leave note",
      inputs: [
        {
          name: "message",
          type: "string",
        }
      ],
      buttons: [
        {
          text: "Confirm",
          handler: (e) => {
            this.str_note = e.message;
          },

        }, {
          text: "Cancel",
          role: "cancel"
        }
      ]
    });
    await alert.present();
  }

  test() {
    console.log(this.dt_pickup);
  }

  addPassenger() {
    this.nm_passengers++;
  }

  reducePassenger() {
    this.nm_passengers--;
  }

  setPickupTime() {
    document.getElementById("datetime").click();
  }

  loadMap(lat, lng) {
    this.ltlg_pickup = new LatLng(lat, lng);
    this.map = new google.maps.Map(
      document.getElementById('map'), { zoom: 18, center: this.ltlg_pickup, clickableIcons: false });

    if (this.ui_marker_pickup) {
      this.ui_marker_pickup.setMap(null);
    }
    this.ui_marker_pickup = new google.maps.Marker({
      position: this.ltlg_pickup
    });
    this.ui_marker_pickup.setMap(this.map);

    var geocoder = new google.maps.Geocoder;
    this.geocodeLatLng(geocoder, this.ltlg_pickup, this.map, this.updatePickupName.bind(this));
  }

  focusNewLocation() {
    //future development
    if (this.timer) {
      clearTimeout(this.timer);
      console.log("timeout cleared")
      this.timer = null
    }
    this.timer = setTimeout(this.setDestination.bind(this), 2000);
  }

  setDestination() {
    var place = new google.maps.places.PlacesService(this.map);
    var request = { query: this.str_destination, fields: ["geometry"] };
    place.findPlaceFromQuery(request, this.updateDestinationData.bind(this))
  }

  updateDestinationData(results, status) {

    if (status === google.maps.places.PlacesServiceStatus.OK) {
      this.map.setCenter(results[0].geometry.location);
      this.ltlg_destination = results[0].geometry.location;

      if (this.ui_marker_destination) {
        this.ui_marker_destination.setMap(null);
      }
      this.ui_marker_destination = new google.maps.Marker({
        position: results[0].geometry.location,
      });
      this.ui_marker_destination.setMap(this.map);

      var geocoder = new google.maps.Geocoder;
      this.geocodeLatLng(geocoder, this.ltlg_destination, this.map, this.updateDestinationName.bind(this));
    }

  }

  updatePickupName(name) {
    this.str_pickup = name;
  }
  updateDestinationName(name) {
    this.str_destination = name;
  }


  geocodeLatLng(geocoder, ltlg_location, map, callback) {
    geocoder.geocode({ 'location': ltlg_location }, function (results, status) {
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

  confirmBooking() {

  }

  calculateFare() {
    console.log("pickup", this.str_pickup,
      this.ltlg_pickup,
      "dest",
      this.str_destination,
      this.ltlg_destination,
      "passengers",
      this.nm_passengers, "book type",
      this.bl_preBook, "pickup date",
      this.dt_pickup, "note", this.str_note);

    // this.http.get("http://localhost:8000/", {responseType:"text"}).toPromise().then(e => {
    //   console.log(e);
    // });
    let httpParams: HttpParams;
    httpParams.append("origin", `${this.ltlg_pickup.lat},${this.ltlg_pickup.lng}`);
    httpParams.append("destination", `${this.ltlg_destination.lat},${this.ltlg_destination.lng}`);
    this.http.get("http://localhost:8000/route_estimation", { responseType: "text", params: httpParams },
    ).toPromise().then(response => {
      console.log(response);
    }).catch(error => {
      console.log("failed")
    });
    return;

  }
