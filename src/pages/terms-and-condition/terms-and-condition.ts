import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {RegisterPage} from '../register/register';
/*
  Generated class for the TermsAndCondition page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-terms-and-condition',
  templateUrl: 'terms-and-condition.html'
})
export class TermsAndConditionPage {
  private showHeader;
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsAndConditionPage');
  }
  goBack(){
    if (localStorage.getItem('username')){
        this.navCtrl.pop();
    }else{
      this.navCtrl.setRoot(RegisterPage);
    }
  }

}
