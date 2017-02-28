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
import {ProjectPage} from '../project-page/project-page';
import {SearchResultPage} from '../search-result-page/search-result-page';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
declare var window: any;
@Component({
  selector: 'milestone-page',
  templateUrl: 'milestone-page.html',
})
export class MilestonePage {
    private queryWord = "";
    private loader: any;
    private base64Image;
    private howMilstone = true;
    private milestones = [];
    private modelArray = [];
    private showMilestoneArray = [];
    private milData;
    private milID;
    private vouchCount;
    // get sample data only
    private projID;
    constructor(private nav: NavController,  private params: NavParams, private setService: SettingsService, private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public alertCtrl: AlertController, public newPostService: NewPostServices) {
            // set sample data
            this.milID = this.params.get('id');
            this.loader = loadingCtrl.create({
            content: "Grabbing Milestones...",
            });
            this.loader.present();
   }

    ngOnInit(): void {
        
        var subcription = this.postService.getMilestonePost(this.milID).subscribe((data) => {
            this.milData = JSON.parse(data);
            if (this.milData.status == false) {
                var alert_1 = this.showAlert(this.milData.error);
            }
            else {
                this.vouchCount = this.milData.vouch_count;
            }
        }, (error) => {
            console.log(error);
            this.loader.dismiss();
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => {
            console.log("Finished! ");
            this.loader.dismiss();
        });
    };

    createVouch  (mil_Id) {
        
        console.log("create vouch id ", mil_Id);
        var subcription = this.postService.postNewVouch(mil_Id).subscribe((data) => {
            var vouchData = JSON.parse(data);
            console.log(vouchData);
            if (vouchData.status == false) {
                var alert_2 = this.showAlert(vouchData.error);
            }
            else {
                this.vouchCount = vouchData.count;
            }
        }, (error) => {
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => { return console.log("Finished!"); });
    };
    viewMilestone  (feedId) {
        this.nav.setRoot(MilestonePage, { id: feedId }).then((data) => {
            console.log(data, " viewmil data");
        });
        console.log(feedId, " feed id");
    };
    createSeenCount  (milId) {
        
        var seenData;
        var subcription = this.postService.postMilestoneNewSeen(this.milID).subscribe((data) => {
            seenData = JSON.parse(data);
            if (seenData.status == false) {
                var alert_3 = this.showAlert(seenData.error);
            }
        }, (error) => {
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => { return console.log("Finished! "); });
    };
    // on click, go to user timeline
    viewUser  (userId) {
        this.nav.setRoot(UserPage, { id: userId });
    };
    viewProject  (id) {
        this.nav.push(ProjectPage, { id: id });
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
