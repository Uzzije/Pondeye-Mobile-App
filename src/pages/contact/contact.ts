import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {UserService} from '../../services/user-service';
import {UserPage} from "../user/user";

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
    public contacts: any;

    constructor(public nav: NavController, public userService: UserService) {

    }

    // view contact
    viewContact(id) {
      this.nav.push(UserPage, {id: id});
    }
}
