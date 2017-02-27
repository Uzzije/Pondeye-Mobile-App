import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ActivityPage} from "../activity/activity";
import {LoginPage} from "../login/login";
import {RegisterPage} from '../register/register';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(private nav: NavController) {
  }

    goToSignUp = function () {
        this.nav.setRoot(RegisterPage);
    };
    // to go login page
    login = function () {
        if (localStorage.getItem("username")) {
            this.nav.setRoot(ActivityPage);
        }
        else {
            this.nav.setRoot(LoginPage);
        }
    };
}
