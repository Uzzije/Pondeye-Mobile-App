import {Component} from '@angular/core';
import {NavController, ActionSheetController, NavParams, LoadingController, AlertController,  Platform} from 'ionic-angular';

import {PostService} from '../../services/post-service';
import {PostPage} from "../post/post";
import {UserPage} from "../user/user";
import {NewPostPage} from "../new-post/new-post";
import {Camera} from 'ionic-native';
import {NewPostServices} from '../../services/new-post-service';
import {SettingsService} from '../../services/settings-service';
import {NewPictureUploadPage} from '../pictureUpload/pictureUpload';
import {SearchResultPage} from '../search-result-page/search-result-page';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
declare var window: any;
@Component({
  selector: 'personal-info-edit-page',
  templateUrl: 'personal-info-edit.html',
})
export class PersonalInfoEditPage {
    private queryWord = "";
    private loader: any;
    private base64Image;
    private hasMilstone = true;
    private milestones = [];
    private modelArray = [];
    private showMilestoneArray = [];
    // get sample data only
    private projID;
    private personalInfoData;
    private firstName;
    private lastName;
    private email;
    private milestoneList = [];
    constructor(private nav: NavController, private setService: SettingsService, private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public alertCtrl: AlertController, public newPostService: NewPostServices) {
            // set sample data
            this.loader = loadingCtrl.create({
            content: "Grabbing personal information...",
            });
            this.loader.present();
   }

    ngOnInit(): void {
        
        var subcription = this.setService.getPersonalEditData().subscribe((data) => {
           this.personalInfoData = JSON.parse(data);
            console.log(this.personalInfoData);
            if (this.personalInfoData.status == false) {
                var alert_1 =this.showAlert(this.personalInfoData.error);
            }
            else {
               this.firstName =this.personalInfoData.first_name;
               this.lastName =this.personalInfoData.last_name;
               this.email =this.personalInfoData.email;
            }
        }, (error) => {
            console.log(error);
           this.loader.dismiss();
            var alert =this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => {
            console.log("Finished! " +this.personalInfoData);
           this.loader.dismiss();
        });
    };
    hideMilView  (milId) {
        for (var el = 0; el < this.milestoneList.length; el++) {
            if (this.milestoneList[el].id == milId) {
                this.milestoneList[el].hidden == true;
                break;
            }
        }
    };
  updateIdentity = () => {
        
        var subcribe = this.setService.updatedPersonalInfo(this.firstName, this.lastName, this.email).subscribe((data) => {
           this.personalInfoData = JSON.parse(data);
            if (this.personalInfoData.status === false) {
                var alert_2 =this.showAlert(this.personalInfoData.error);
            }
            else {
               this.showToast("Information Updated!");
            }
        }, (error) => {
            console.log(error);
            var alert =this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => { return console.log("Finished!"); });
    };
    updatePassword  (oldPassword, newPassword, confirmPassword) {
        
        if (newPassword == confirmPassword) {
            var subcribe = this.setService.updatedPersonalPassword(newPassword, oldPassword).subscribe((data) => {
               this.personalInfoData = JSON.parse(data);
                if (this.personalInfoData.status === false) {
                    var alert_3 =this.showAlert(this.personalInfoData.error);
                }
                else {
                    localStorage.setItem("password", newPassword);
                   this.showToast("Information Updated!");
                }
            }, (error) => {
                console.log(error);
               this.loader.dismiss();
                var alert =this.showAlert("Oops. Something Went Wrong! Restart the app!");
            }, () => { return console.log("Finished!"); });
        }
        else {
            var alert_4 = this.showAlert("Password Must Match!");
        }
    };

    search  (ev) {
        var queryWord = ev.target.value;
        if (queryWord.length > 0) {
            this.nav.setRoot(SearchResultPage, { queryWord: queryWord });
            console.log(this.queryWord, " query word");
        }
    }

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
        });
    };
    
    // create a new post
    createPost = () => {
        this.nav.push(NewPostPage);
    };
    createPicture = () => {
        this.takePicture();
    };
     takePicture (){ 
          Camera.getPicture({
            destinationType:  Camera.DestinationType.DATA_URL,
            mediaType: Camera.MediaType.PICTURE,
            encodingType: Camera.EncodingType.JPEG,
            correctOrientation: true
        }).then((imageData) => {
            this.base64Image = "data:image/jpeg;base64," + imageData;
            console.log('base64Image pic ', this.base64Image);
            this.nav.push(NewPictureUploadPage, { 'fileName': this.base64Image });
        }, function (err) {
            console.log(err);
        });
    }
    
}
