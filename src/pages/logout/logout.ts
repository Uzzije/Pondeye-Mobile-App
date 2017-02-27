import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ActivityPage} from "../activity/activity";
import {RegisterPage} from "../register/register";
import {LoginPage} from "../login/login";

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(private nav: NavController) {
    try {
            localStorage.removeItem("username");
            localStorage.removeItem("password");
        }
        catch (err) {
        }
        this.nav.setRoot(LoginPage);
  }

}
