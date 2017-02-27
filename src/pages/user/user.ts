import {Component} from '@angular/core';
import {NavController, ActionSheetController, NavParams, LoadingController, AlertController,  Platform} from 'ionic-angular';

import {PostService} from '../../services/post-service';
import {PostPage} from "../post/post";

import {NewPostPage} from "../new-post/new-post";
import {Camera} from 'ionic-native';
import {NewPostServices} from '../../services/new-post-service';
import {SettingsService} from '../../services/settings-service';
import {NewPictureUploadPage} from '../pictureUpload/pictureUpload';
import {MilestonePage} from '../milestone-page/milestone-page';
import {NotificationService} from '../../services/notification-service';
import {ProjectPage} from '../project-page/project-page';
import {SearchResultPage} from '../search-result-page/search-result-page';
import {PondService} from '../../services/pond-service';
import {UserService} from '../../services/user-service';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
declare var window: any;
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  public user: any;
  private queryWord = "";
  private loader: any;
  private base64Image;
  private userId;
  private userData;
  private userDetails;
  private profilePic;
  private profilePicStorage;
  private aval_pond;
  private currentMilestone;
  private currentProjects;
  private completedMilCount;
  private completedProjCount;
  private failedMilCount;
  private failedProjCount;
  private firstName;
  private lastName;
  private statusOfUser;
  private profUserId;
  private yourProfile;
  private userName = localStorage.getItem('username');
  private selectedPond;
  private cover_url = 'assets/img/cover.jpg';
  constructor(private nav: NavController, private userService: UserService, private pondService: PondService, 
              private navParams: NavParams, private setService: SettingsService, private postService: PostService, 
              public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public alertCtrl: AlertController, public newPostService: NewPostServices) {
    // get sample data only
   this.userId = this.navParams.get('id');
   this.loader = this.loadingCtrl.create({
            content: "Grabbing profile...",
    });
    this.loader.present();
  }

      ngOnInit(): void {
        
        var subcription = this.userService.getUserInformation(this.userId).subscribe((data) => {
            this.userData = JSON.parse(data);
            if (this.userData.status == false) {
                var alert_1 = this.showAlert(this.userData.error);
            }
            else {
                this.userDetails = this.userData.user_details;
                this.profilePic = this.userDetails.profile_url;
                this.profilePicStorage = this.userDetails.profile_url_storage;
                this.aval_pond = this.userDetails.aval_pond;
                this.currentMilestone = this.userDetails.current_tasks;
                this.currentProjects = this.userDetails.current_projs;
                this.completedMilCount = this.userDetails.completed_mil_count;
                this.completedProjCount = this.userDetails.completed_proj_count;
                this.failedMilCount = this.userDetails.failed_mil_count;
                this.failedProjCount = this.userDetails.failed_proj_count;
                this.firstName = this.userDetails.first_name;
                this.lastName = this.userDetails.last_name;
                this.statusOfUser = this.userDetails.status_of_user;
                this.profUserId = this.userDetails.user_id;
                this.yourProfile = this.userDetails.is_own_profile;
                console.log(this.userDetails);
                console.log("profile pic, ", this.profilePicStorage);
                if (this.yourProfile) {
                    localStorage.setItem("profile_url", this.profilePicStorage);
                }
                else {
                    this.userName = this.userDetails.user_name;
                }
                console.log(localStorage.getItem("profile_url"));
            }
        }, (error) => { this.loader.dismiss(); var alert = this.showAlert(error); }, () => {
            console.log("Finished! ");
            this.loader.dismiss();
        });
    };

  changProfilePicture = function (user_id) {
        
        //this.takeProfilePicture();
        if (this.base64Image) {
            var subscribe = this.picUploadService.profilePictureUpload(this.base64Image, user_id);
            subscribe.subscribe((data) => {
                var statusData = JSON.parse(data);
                if (statusData.status === false) {
                    var alert_2 = this.showAlert(statusData.error);
                }
                else {
                    this.profilePic = statusData.url;
                    this.showToast("Information Updated!");
                    console.log(this.profilePic);
                }
            }, (error) => { return alert(error); }, () => { return console.log("Finished! "); });
        }
    };

    markProjectDone = function (projId) {
        
        var subscribe = this.userService.markProjectDone(projId);
        subscribe.subscribe((data) => {
            var statusData = JSON.parse(data);
            if (statusData.status === false) {
                var alert_3 = this.showAlert(statusData.error);
            }
            else {
                this.showToast("Completion Noted!");
            }
        }, (error) => { return alert(error); }, () => { return console.log("Finished! "); });
    };

    markMilestoneDone = function (milId) {
        
        console.log("lay it down for gospel ");
        var subscribe = this.userService.markMilestoneDone(milId);
        subscribe.subscribe((data) => {
            var statusData = JSON.parse(data);
            if (statusData.status === false) {
                var alert_4 = this.showAlert(statusData.error);
            }
            else {
                this.showToast("Completion Noted!");
            }

        });
    }

    addUsertoPond () {
        var subscribe = this.pondService.addUserToPond(this.selectedPond, this.profUserId);
        subscribe.subscribe(function (data) {
            var statusData = JSON.parse(data);
            if (statusData.status === false) {
                var alert_5 = this.showAlert(statusData.error);
            }
            else {
                this.aval_pond = statusData.aval_pond;
                this.showToast("Added to Pond!");
            }
        }, function (error) { 
            return alert(error); }, function () { return console.log("Finished! "); 
        });
    }

   search = function (ev) {
        var queryWord = ev.target.value;
        if (queryWord.length > 0) {
            this.nav.setRoot(SearchResultPage, { queryWord: queryWord });
            console.log(this.queryWord, " query word");
        }
    }

    showAlert = function (mes) {
        var alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: mes,
            buttons: ['OK']
        });
        alert.present();
    }

    showToast (mes) {
        this.platform.ready().then(() => {
            window.plugins.toast.show(mes, "short", "top");
        });
    }

    createPost = () => {
        this.nav.push(NewPostPage);
    };
    createPicture = () => {
        this.takePicture();
    };
    takePicture = () => {
        
        Camera .getPicture({
            destinationType: Camera .DestinationType.DATA_URL,
            mediaType: Camera .MediaType.PICTURE,
            encodingType: Camera .EncodingType.JPEG,
            correctOrientation: true
        }).then(function (imageData) {
            this.base64Image = "data:image/jpeg;base64," + imageData;
            this.nav.setRoot(NewPictureUploadPage, { 'fileName': this.base64Image });
        }, function (err) {
            console.log(err);
        });
    };

}
