import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginId: string;
  loginPwd: string;
  csrfToken: string = this.getCookie("XSRF-TOKEN");
  constructor(private http: HttpClient, private alertController: AlertController, private router: Router) { }

  ngOnInit() {
    this.http.get(`${environment.serverUrl}/`).toPromise().then((response: Response) => {
    })
  }

  loginUser() {
    const headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    this.http.post(`${environment.serverUrl}/login`, { headers: headers }).toPromise().then(response => {
      const data = JSON.parse(response.toString());
      console.log(data);
      if (data.status !== 200) {
        alert("login failed");
      } else {
        alert("login success");
        this.router.navigateByUrl("home");
      }
    });
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
      alert("Password did not match.");
      return false;
    } else if (data.loginId && data.confirmPassword && data.password) {
      this.http.post(`${environment.serverUrl}/register`, {
        id: data.loginId,
        pwd: data.password
      }, {
        headers: headers
      }).toPromise().then(response => {
        const jsonObj = JSON.parse(response.toString());
        console.log("response", jsonObj);
      })
    } else {
      alert("Please check your registration.");
      return false;
    }
    return true;
  }
}
