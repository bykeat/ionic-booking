import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UtilityService } from 'src/service/UtilityServiceProvider';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(private http: HttpClient, private alertController: AlertController, private utilityService: UtilityService, private toastController: ToastController, private router: Router) { }

  showSpinner: boolean = false;
  loginId: string;
  loginPwd: string;
  csrfToken: string = this.utilityService.getCookie("XSRF-TOKEN");

  ngOnInit() {
    this.http.get(`${environment.serverUrl}/`).toPromise().then((response: Response) => {
      //Get CSRF Token from Laravel
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
        this.utilityService.showToast("Login", response.message);
      } else {
        this.utilityService.showToast("Login", response.message);
        this.router.navigateByUrl("home");
      }
    });
  }

  async registerUser() {
    const register = await this.alertController.create({
      header: "Register User",
      inputs: [
        {
          name: "name",
          placeholder: "Enter name",
          type: "text",
        },
        {
          name: "loginId",
          placeholder: "Enter email address",
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



  registrationCallback(response) {
    console.log(response);
    if (response.status !== 200) {
      this.utilityService.showToast("Registration failed.", response.message);
    } else {
      this.utilityService.showToast("Registration successful.", response.message);
    }
  }

  submitRegistration(data) {
    const headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');

    if (data.confirmPassword !== data.password) {
      this.utilityService.showToast("Error!", "Password did not match.");
      return false;
    } else if (data.loginId && data.confirmPassword && data.password && data.name) {
      var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regex.test(data.loginId)) {
        this.httpRegister(data);
        return true;
      } else {
        this.utilityService.showToast("Invalid email format!", "Please check your email.");
        return false;
      }
    } else {
      this.utilityService.showToast("Invalid registration!", "Ensure your registration is complete.");
      return false;
    }
  }

  async httpRegister(data) {
    await this.http.get(`${environment.serverUrl}/register`, {
      params: {
        id: data.loginId,
        pwd: data.password,
        name: data.name
      }
    }).toPromise().then(this.registrationCallback.bind(this))
  }
}
