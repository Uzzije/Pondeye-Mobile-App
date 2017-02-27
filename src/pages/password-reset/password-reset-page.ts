import {Component} from '@angular/core';
import {NavController, ActionSheetController, LoadingController, AlertController,  Platform} from 'ionic-angular';
import {ActivityPage} from "../activity/activity";
import {RegisterPage} from "../register/register";
import {SettingsService} from '../../services/settings-service';
import {AuthenticateService} from '../../services/authenticate-service';
import {Network} from 'ionic-native';
import {LoginPage} from "../login/login";

declare var window;
@Component({
  selector: 'page-password-reset',
  templateUrl: 'password-reset-page.html',
})
export class PasswordResetPage {
  
  constructor(private nav: NavController,  private authService: AuthenticateService,
            public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public alertCtrl: AlertController) {
  }

// login and go to home page
    reset = function (email, newPassword, confPassword, passToken) {
            if (Network.connection === 'none') {
                var alert_1 = this.showAlert("Hey! Pondeye requires internet connection to work!");
            }
            else {
                if (email && newPassword && passToken && (confPassword == newPassword)) {
                    this.loader = this.loadingCtrl.create({
                        content: "Reseting Password...",
                    });
                    this.loader.present();
                    this.authService.passwordResetService(email, newPassword, passToken)
                        .subscribe((data) => {
                        this.getData = JSON.parse(data);
                        if (this.getData) {
                            if (this.getData.status == true) {
                                localStorage.setItem("username", this.getData.username);
                                localStorage.setItem("password", newPassword);
                                this.nav.setRoot(ActivityPage);
                            }
                            else {
                                var alert_2 = this.showAlert(this.getData.error);
                                localStorage.removeItem('username');
                                localStorage.removeItem('password');
                            }
                        }
                    }, (error) => { var alert = this.showAlert(error); }, () => {
                        console.log("Finished!");
                        this.loader.dismiss();
                    });
                }
                else {
                    if ((confPassword !== newPassword)) {
                        var alert_3 = this.showAlert("Your Password do not match");
                    }
                    else {
                        var alert_4 = this.showAlert("Make sure your inputs are valid, including your email");
                    }
                }
            }
        };
    sendResetCode = function (email) {
        if (email) {
            this.loader = this.loadingCtrl.create({
                content: "Sending Code...",
            });
            this.loader.present();
            this.authService.sendActivationCode(email).subscribe((data) => {
                this.resetCodeData = JSON.parse(data);
                if (this.resetCodeData) {
                    if (this.resetCodeData.status == true) {
                        var title = "Success!";
                        var alert_5 = this.showAlert('Reset code sent to this email: ' + email, title=title);
                    }
                    else {
                        var alert_6 = this.showAlert(this.resetCodeData.error);
                    }
                }
            }, (error) => {
                console.log(error);
                this.loader.dismiss();
                var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
            }, () => {
                console.log("Finished!");
                this.loader.dismiss();
            });
        }
        else {
            var alert_7 = this.showAlert("Email field is needed to send reset code!");
        }
    };

    signUp (){
        this.nav.setRoot(RegisterPage);
    };

     login = () => {
        this.nav.setRoot(LoginPage);
    };

    showAlert = function (mes, title="Error!") {
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: mes,
            buttons: ['OK']
        });
        alert.present();
    };
    showToast = function (mes) {
        this.platform.ready().then(() => {
            window.plugins.toast.show(mes, "short", "top");
        });
    };

}
