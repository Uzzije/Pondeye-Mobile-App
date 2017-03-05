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
import {MilestonePage} from '../milestone-page/milestone-page';
import {SearchResultPage} from '../search-result-page/search-result-page';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
declare var window: any;
@Component({
  selector: 'project-page',
  templateUrl: 'project-page.html',
})
export class ProjectPage {
    private queryWord = "";
    private loader: any;
    private base64Image;
    private milestones = [];
    // get sample data only
    private projID;
    private projData;
    private followCount; 
    private noMotif = false;
    constructor(private nav: NavController,  private params: NavParams, private setService: SettingsService, 
              private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public alertCtrl: AlertController, public newPostService: NewPostServices) {
            // set sample data
            this.projID = this.params.get('id');
            this.loader = loadingCtrl.create({
            content: "Getting ponders fitness activities...",
            });
            this.loader.present();
   }

  ngOnInit(): void {
        
        var subcription = this.postService.getProjectPost(this.projID).subscribe((data) => {
            this.projData = JSON.parse(data);
            if (this.projData.status == false) {
                var alert_1 = this.showAlert(this.projData.error);
            }
            else {
                this.followCount = this.projData.follow_count;
                //console.log("follow, count", this.followCount);
                this.milestones = this.projData.mil_list;
                if(this.projData.motif.length == 0){
                    this.noMotif = true;
                }
            }
        }, (error) => { this.loader.dismiss(); var alert = this.showAlert(error); }, () => {
            console.log("Finished! ");
            this.loader.dismiss();
        });
    };

    createSeenCount  (proj_Id) {
        
        var seenData;
        var subcription = this.postService.postProjectNewSeen(proj_Id).subscribe((data) => {
            seenData = JSON.parse(data);
            //console.log(seenData);
            if (seenData.status == false) {
                var alert_2 = this.showAlert(seenData.error);
            }
        }, (error) => { return alert(error); }, () => { return console.log("Finished! "); });
    };

    createFollow  (proj_Id) {
        
        var subcription = this.postService.postNewFollow(proj_Id).subscribe((data) => {
            var followData = JSON.parse(data);
            //console.log(followData);
            if (followData.status == false) {
                var alert_3 = this.showAlert(followData.error);
            }
            else {
                this.followCount = followData.count;
            }
        }, (error) => { return alert(error); }, () => { return console.log("Finished! "); });
    };

    viewMilestone  (feedId) {
        this.nav.push(MilestonePage, { id: feedId }).then((data) => {
            //console.log(data, " viewmil data");
        });
        //console.log(feedId, " feed id");
    };

    // on click, go to user timeline
    viewUser  (userId) {
        this.nav.setRoot(UserPage, { id: userId });
    };

    search  (ev) {
        var queryWord = ev.target.value;
        if (queryWord.length > 0) {
            this.nav.setRoot(SearchResultPage, { queryWord: queryWord });
            //console.log(this.queryWord, " query word");
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
            destinationType:  Camera.DestinationType.FILE_URI,
            mediaType: Camera.MediaType.PICTURE,
            encodingType: Camera.EncodingType.JPEG,
            correctOrientation: true
        }).then((imageData) => {
            this.base64Image = "data:image/jpeg;base64," + imageData;
            //console.log('base64Image pic ', this.base64Image);
            this.nav.push(NewPictureUploadPage, { 'fileName': this.base64Image });
        }, function (err) {
            console.log(err);
        });
     }
    
}
