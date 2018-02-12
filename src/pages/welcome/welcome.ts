import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ActivityPage} from "../activity/activity";
import {LoginPage} from "../login/login";
import {RegisterPage} from '../register/register';
import {TabsPage} from '../tabs/tabs';
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

    goToSignUp  () {
        this.nav.setRoot(RegisterPage);
    };
    // to go login page
    login  () {
        if (localStorage.getItem("username")) {
            this.nav.setRoot(TabsPage);
        }
        else {
            this.nav.setRoot(LoginPage);
        }
    };
}
