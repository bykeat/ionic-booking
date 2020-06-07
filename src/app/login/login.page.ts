import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showSpinner: boolean = false;
  loginId: string;
  loginPwd: string;
  csrfToken: string = this.getCookie("XSRF-TOKEN");
  constructor(private http: HttpClient, private alertController: AlertController, private toastController: ToastController, private router: Router) { }

  ngOnInit() {
    this.http.get(`${environment.serverUrl}/`).toPromise().then((response: Response) => {
    })
  }

  loginUser() {

    const headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');

    this.showSpinner = true;
    this.http.get(`${environment.serverUrl}/login`, {
      headers: headers, params: {
        id: this.loginId,
        pwd: this.loginPwd
      }
    }).toPromise().then((response: any) => {
      this.showSpinner = false;
      if (response.status !== 200) {
        this.popupToast(response.message, "Login");
      } else {
        this.popupToast(response.message, "Login");
        this.router.navigateByUrl("home");
      }
    });
  }

  async popupToast(message, title) {
    const toast = await this.toastController.create({
      header: title,
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async registerUser() {
    const register = await this.alertController.create({
      header: "Register User",
      inputs: [
        {
          name: "loginId",
          placeholder: "Enter login ID",
          type: "text",
        }, {
          name: "password",
          placeholder: "Enter a password",
          type: "password",
        }, {
          name: "confirmPassword",
          placeholder: "Repeat the password",
          type: "password",
        }
      ],
      buttons: [
        {
          text: "Register",
          handler: (e) => {
            return this.submitRegistration(e);
          },

        }, {
          text: "Cancel",
          role: "cancel"
        }
      ]
    });
    await register.present();
  }

  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  submitRegistration(data) {
    const headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');

    if (data.confirmPassword !== data.password) {
      this.popupToast("Password did not match.", "Error!");
      return false;
    } else if (data.loginId && data.confirmPassword && data.password) {
      var regex = new RegExp("^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$");
      if (regex.test(data.loginId))
        this.http.get(`${environment.serverUrl}/register`, {
          params: {
            id: data.loginId,
            pwd: data.password
          }
        }).toPromise().then((response: any) => {
          if (response.status !== 200) {
            this.popupToast(response.message, "Registration failed");
          } else {
            this.popupToast(response.message, "Registration successful");
          }
        })
      else
        this.popupToast("Please check your email is correct", "Invalid email")
    } else {
      this.popupToast("Please check your registration.", "Error!");
      return false;
    }
    return true;
  }
}
