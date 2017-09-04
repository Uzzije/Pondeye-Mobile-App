import {Component} from '@angular/core';
import {NavController, ActionSheetController, LoadingController, AlertController,  Platform} from 'ionic-angular';
import {ActivityPage} from "../activity/activity";
import {RegisterPage} from "../register/register";
import {PostService} from '../../services/post-service';
import {PostPage} from "../post/post";
import {UserPage} from "../user/user";
import {NewPostPage} from "../new-post/new-post";
import {Camera} from '@ionic-native/camera';
import {NewPostServices} from '../../services/new-post-service';
import {SettingsService} from '../../services/settings-service';
import {NewPictureUploadPage} from '../pictureUpload/pictureUpload';
import {MilestonePage} from '../milestone-page/milestone-page';
import {PondService} from '../../services/pond-service';
import {UserService} from '../../services/user-service';
import {AuthenticateService} from '../../services/authenticate-service';
import {Network} from '@ionic-native/network';
import {PasswordResetPage} from '../password-reset/password-reset-page';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

declare var window;
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [Network]
})
export class LoginPage {
  private getData;
  private loader;
  constructor(private nav: NavController,  private authService: AuthenticateService,
            private setService: SettingsService, private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, private network: Network, public alertCtrl: AlertController, public newPostService: NewPostServices) {
                      this.loader = loadingCtrl.create({
                        content: "Logging in...",
                      });
        let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
            var alert_1 = this.showAlert("Hey! Pondeye requires internet connection to work!");
         });                 
  }

          // login and go to home page
        login (username, userPassword) {

            //console.log("Name: " + username + "Password: " + userPassword);
            //console.log("I return", this.authService.authenticate(username, userPassword));
            if (this.indentificationMatch(username, userPassword)) {
                this.nav.setRoot( ActivityPage);
            }
            else {
                this.loader.present();
                this.authService.authenticate(username, userPassword)
                    .subscribe((data) => {
                    this.getData = JSON.parse(data);
                    if (this.getData) {
                        if (this.getData.status == true) {
                            localStorage.setItem("username", username);
                            localStorage.setItem("password", userPassword);
                            this.nav.setRoot( ActivityPage);
                        }
                        else {
                            var alert_2 = this.showAlert(this.getData.error);
                        }
                    }
                }, (error) => { 
                    this.loader.dismiss();
                    var alert = this.showAlert(error); }, 
                    () => { 
                        this.loader.dismiss();
                        return console.log("Finished!"); 
                        },
                );
            }
            
        };

   indentificationMatch (username, password) {
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
    // go sign up page
    signUp (){
        this.nav.setRoot(RegisterPage);
    };

    goToPassReset () {
        this.nav.setRoot(PasswordResetPage);
    };

    showAlert  (mes) {
        var alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: mes,
            buttons: ['OK']
        });
        alert.present();
    };
    showToast  (mes) {
        this.platform.ready().then(() => {
            window.plugins.toast.show(mes, "short", "top");
        }).catch(()=>{
        });
    };

}
