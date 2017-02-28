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
  selector: 'milestone-edit-page',
  templateUrl: 'milestone-edit.html',
})
export class MilestoneEditPage {
    private queryWord = "";
    private loader: any;
    private base64Image;
    private hasMilestone = false;
    private milestones = [];
    private modelArray = [];
    private showMilestoneArray = [];
    // get sample data only
    private milEditData;
    private milestoneList;
    constructor(private nav: NavController, private setService: SettingsService, private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public alertCtrl: AlertController, public newPostService: NewPostServices) {
            // set sample data
            this.loader = loadingCtrl.create({
            content: "Grabbing Milestone Entries...",
            });
            this.loader.present();
   }

  ngOnInit(): void {
        
        var subcription = this.setService.getUserMilestoneData().subscribe((data) => {
            this.milEditData = JSON.parse(data);
            console.log(this.milEditData);
            if (this.milEditData.status == false) {
                var alert_1 = this.showAlert(this.milEditData.error);
            }
            this.milestoneList = this.milEditData.milestones_list;
            if (this.milestoneList.length > 0) {
                this.hasMilestone = true;
                for (var item = 0; item < this.milestoneList.length; item++) {
                    var nextId = this.milestoneList[item].id;
                    var milValue = this.milestoneList[item].mil_name;
                    this.modelArray[nextId] = milValue;
                    this.showMilestoneArray[nextId] = true;
                }
            }
        }, (error) => {
            console.log(error);
            this.loader.dismiss();
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => {
            console.log("Finished! " + this.milEditData);
            this.loader.dismiss();
        });
    };

    updateMilestone  (milId) {
        
        console.log("this mil " + milId + " " + this.modelArray[milId]);
        var subcribe = this.setService.updateMilestone(milId, this.modelArray[milId]).subscribe((data) => {
            this.milEditData = JSON.parse(data);
            if (this.milEditData.status === false) {
                var alert_2 = this.showAlert(this.milEditData.error);
            }
            else {
                this.showToast("Updated Milestone!");
            }
        }, (error) => {
            console.log(error);
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => { return console.log("Finished!"); });
    };

    createSeenCount  (proj_Id) {
        
        var seenData;
        var subcription = this.postService.postProjectNewSeen(proj_Id).subscribe((data) => {
            seenData = JSON.parse(data);
            console.log(seenData);
            if (seenData.status == false) {
                var alert_2 = this.showAlert(seenData.error);
            }
        }, (error) => { return alert(error); }, () => { return console.log("Finished! "); });
    };

   deleteMilestone  (milId) {
        
        var subcribe = this.setService.deleteMilestone(milId).subscribe((data) => {
            this.milEditData = JSON.parse(data);
            if (this.milEditData.status === false) {
                var alert_3 = this.showAlert(this.milEditData.error);
            }
            else {
                this.showMilestoneArray[milId] = false;
                this.showToast("Milestone Deleted");
            }
        }, (error) => {
            console.log(error);
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => { return console.log("Finished!"); });
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
         this.loader = this.loadingCtrl.create({
            content: "processing picture...",
            });
          this.loader.present();
          Camera.getPicture({
            destinationType:  Camera.DestinationType.DATA_URL,
            mediaType: Camera.MediaType.PICTURE,
            encodingType: Camera.EncodingType.JPEG,
            correctOrientation: true
        }).then((imageData) => {
            this.base64Image = "data:image/jpeg;base64," + imageData;
            console.log('base64Image pic ', this.base64Image);
            this.loader.dismiss();
            this.nav.push(NewPictureUploadPage, { 'fileName': this.base64Image });
        }, function (err) {
            console.log(err);
            this.loader.dismiss();
        });
    }
    
}
