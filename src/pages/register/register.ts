import {Component} from '@angular/core';
import {ActivityPage} from "../activity/activity";
import {NavController, AlertController, ActionSheetController, Platform, Content} from 'ionic-angular';

import {PostService} from '../../services/post-service';
import {UserPage} from "../user/user";
import {LoginPage} from '../login/login';
import {AboutPage} from '../about/about';
import {AuthenticateService} from '../../services/authenticate-service';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

 private edusername = false;
 private edemail = false;
 private edfirst_name = false;
 private edlast_name = false;
 private edpassword = false;
 private edconf_password = false;
 private getData;
  constructor(public nav: NavController, private authService: AuthenticateService, 
  public postService: PostService, public actionSheetCtrl: ActionSheetController,
              public alertCtrl: AlertController,, public platform: Platform) {
  }


  // sign up and go to home page
    signUp  (username, userPassword, confirmPassword, email, first_name, last_name) {
        
        if (this.indentificationMatch(username, userPassword)) {
            console.log("don't navigat");
            this.nav.setRoot(ActivityPage);
        }
        else {
            if (username === '') {
                this.edusername = true;
                console.log("username " + this.edusername);
            }
            else {
                this.edusername = false;
            }
            if (this.emailIsValid(email) === false) {
                this.edemail = true;
            }
            else {
                this.edemail = false;
            }
            if (first_name === '') {
                this.edfirst_name = true;
            }
            else {
                this.edfirst_name = false;
            }
            if (last_name === '') {
                this.edlast_name = true;
            }
            else {
                this.edlast_name = false;
            }
            if (this.confirmPassword(userPassword, confirmPassword)) {
                this.edconf_password = false;
            }
            else {
                this.edconf_password = true;
            }
            if (last_name && username && this.confirmPassword(userPassword, confirmPassword) && this.emailIsValid(email) && first_name) {
                this.authService.regAuthenticate(username, userPassword, confirmPassword, email, first_name, last_name)
                    .subscribe((data) => {
                    this.getData = JSON.parse(data);
                    console.log("data " + this.getData.success);
                    if (this.getData.success) {
                        if (this.getData.success == "created") {
                            localStorage.setItem("username", username);
                            localStorage.setItem("password", userPassword);
                            this.nav.setRoot(AboutPage, { 'newUser': true });
                        }
                        else {
                            console.log(this.getData.success + " slide please");
                            var alert_1 = this.showAlert(this.getData.success);
                        }
                    }
                }, (error) => { return alert(error); }, () => { return console.log("Finished! " + this.getData.success); });
            }
        }
    };
    emailIsValid  (email) {
        if (email && email.indexOf('@') > -1 && (email.indexOf('@') === email.lastIndexOf('@'))
            && (email.indexOf('.') > email.indexOf('@'))) {
            return true;
        }
        else {
            return false;
        }
    };
    confirmPassword  (password, confirm_password) {
        if (password === '' || confirm_password === '' || password !== confirm_password) {
            return false;
        }
        else {
            return true;
        }
    };
    
     indentificationMatch  (username, password) {
        var currUser = localStorage.getItem("username");
        var currPassword = localStorage.getItem("password");
        if (currUser && currPassword) {
            if ((currUser !== username) || (currPassword !== password)) {
                return false;
            }
            else {
                return true;
            }
        }
        return false;
    };
    login = () => {
        this.nav.setRoot(LoginPage);
    };


    showAlert  (mes) {
        var alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: mes,
            buttons: ['OK']
        });
        alert.present();
    };
    
}
