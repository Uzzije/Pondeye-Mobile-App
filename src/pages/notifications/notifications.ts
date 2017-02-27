import {Component, OnInit} from '@angular/core';
import {NavController, ActionSheetController, NavParams, LoadingController, AlertController,  Platform} from 'ionic-angular';

import {PostService} from '../../services/post-service';
import {PostPage} from "../post/post";
import {UserPage} from "../user/user";
import {NewPostPage} from "../new-post/new-post";
import {Camera} from 'ionic-native';
import {NewPostServices} from '../../services/new-post-service';
import {SettingsService} from '../../services/settings-service';
import {NewPictureUploadPage} from '../pictureUpload/pictureUpload';
import {MilestonePage} from '../milestone-page/milestone-page';
import {NotificationService} from '../../services/notification-service';
import {ProjectPage} from '../project-page/project-page';
import {PondPage} from '../pond-page/pond-page';
import {SearchResultPage} from '../search-result-page/search-result-page';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
declare var window: any;
@Component({
  selector: 'notifications-page',
  templateUrl: 'notifications.html',
})
export class NotificationsPage implements OnInit{
    private queryWord = "";
    private loader: any;
    private base64Image;
    private milestones = [];
    private noNotification = false;
    private dataNotif;
    private notifications;
    // get sample data only
    private projID;
    constructor(private nav: NavController,  private params: NavParams, private setService: SettingsService, private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public notificationService: NotificationService, public alertCtrl: AlertController, public newPostService: NewPostServices) {
            // set sample data
            this.projID = this.params.get('id');
            this.loader = loadingCtrl.create({
            content: "Getting ponder's notifications...",
            });
            this.loader.present();
   }

  ngOnInit(): void {
       
        var subcription = this.notificationService.getNotificationService().subscribe((data) => {
            this.dataNotif = JSON.parse(data);
            console.log(this.dataNotif);
            if (this.dataNotif.status == false) {
                var alert_1 = this.showAlert(this.dataNotif.error);
            }
            else {
                try {
                    localStorage.removeItem("notifClicked");
                }
                catch (err) {
                }
                this.notifications = this.dataNotif.notification_list;
                if (this.notifications.length == 0) {
                    this.noNotification = true;
                }
            }
        }, (error) => { this.loader.dismiss(); var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!"); }, () => {
            console.log("Finished! " + this.dataNotif);
            this.loader.dismiss();
        });
    };
  acceptPondRequest = function (pondRequestId) {
       
        this.loader = this.loadingCtrl.create({
            content: "Accepting Notification..",
        });
        var subcription = this.pondService.acceptPondRequest(pondRequestId).subscribe((data) => {
            this.postData = JSON.parse(data);
            console.log(this.postData);
            if (this.postData.status == false) {
                var alert_2 = this.showAlert(this.postData.error);
            }
            else {
                this.showToast("Request Noted!");
            }
        }, (error) => {
            console.log(error);
            this.loader.dismiss();
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => {
            console.log("Finished! " + this.dataNotif);
            this.loader.dismiss();
        });
    };

  denyPondRequest = function (pondRequestId) {
       
        var subcription = this.pondService.denyUserFromPond(pondRequestId).subscribe((data) => {
            this.postData = JSON.parse(data);
            console.log(this.postData);
            if (this.postData.status == false) {
                var alert_3 = this.showAlert(this.postData.error);
            }
            else {
                this.showToast("Request Noted!");
            }
        }, (error) => { return alert(error); }, () => { return console.log("Finished! " + this.dataNotif); });
    };
  viewUser = function (id) {
        this.nav.push(UserPage, { id: id });
    };
  viewProject = function (isDeleted, projId) {
        if (!isDeleted) {
            this.nav.push(ProjectPage, { id: projId });
        }
        else {
            this.showToast("Project is no longer available!");
        }
    };
  viewPond = function (isDeleted, pondId) {
        if (!isDeleted) {
            this.nav.push(PondPage, { id: pondId });
        }
        else {
            this.showToast("Pond is no longer available!");
        }
    };
  viewMilestone = function (milIsDeleted, id) {
        if (!milIsDeleted) {
            this.nav.push( MilestonePage, { id: id });
        }
        else {
            this.showToast("Milestone is no longer available!");
        }
    };
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
    };
    showToast = function (mes) {
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
