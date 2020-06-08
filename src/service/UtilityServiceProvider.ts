import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
@Injectable({
    providedIn: 'root'
})

export class UtilityService {
    async showToast(title, message) {
        const toast = await new ToastController().create({
            header: title,
            message: message,
            duration: 2000
        });
        toast.present();
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
}