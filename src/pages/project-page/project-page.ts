import {Component} from '@angular/core';
import {NavController, ActionSheetController, NavParams, LoadingController, AlertController,  Platform} from 'ionic-angular';

import {PostService} from '../../services/post-service';
import {PostPage} from "../post/post";
import {UserPage} from "../user/user";
import {NewPostPage} from "../new-post/new-post";
import {Camera} from '@ionic-native/camera';
import {NewPostServices} from '../../services/new-post-service';
import {SettingsService} from '../../services/settings-service';
import {NewPictureUploadPage} from '../pictureUpload/pictureUpload';
import {MilestonePage} from '../milestone-page/milestone-page';
import {SearchResultPage} from '../search-result-page/search-result-page';
import { PhotoViewer } from '@ionic-native/photo-viewer';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
declare var window: any;
@Component({
  selector: 'project-page',
  templateUrl: 'project-page.html',
  providers:[PhotoViewer]
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
    private impressCountList = [];
    private vouchCountList = [];
    constructor(private nav: NavController,  private params: NavParams, private setService: SettingsService, 
              private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, private photoViewer: PhotoViewer,
              public alertCtrl: AlertController, public newPostService: NewPostServices) {
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
                var progressList = this.projData.progresses;
                for(var prog = 0; prog < progressList.length; prog++){
                    var nextId = progressList[prog].progress_id;
                    this.impressCountList[nextId] = progressList[prog].impressed_by;
                    this.vouchCountList[nextId] = progressList[prog].vouch_count;
                }
            }
        }, (error) => { this.loader.dismiss(); var alert = this.showAlert(error); }, () => {
            console.log("Finished! ");
            this.loader.dismiss();
        });
    };

   createImpression(progressId, progressSetId){
        console.log("impress count ", progressSetId);
        this.postService.postNewImpression(progressId, progressSetId).subscribe(data => {
            var impressData = JSON.parse(data);
            //console.log(followData);
            if (impressData.status == false) {
                let alert_3 = this.showAlert(impressData.error);
            }
            else {
                this.impressCountList[progressId] = impressData.count;
            }
        }, error => {
            let alert = this.showAlert("Oops. Something Went Wrong! Check your connection!");
        }, () => { 
            //console.log("Finished! " + this.feedData); 
        });
    }

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

        createVouch (proj_Id, userResponse) {
        //console.log("create vouch id ", mil_Id);
        console.log("user response", userResponse);
        this.postService.postNewVouch(proj_Id, userResponse).subscribe(data => {
            var vouchData = JSON.parse(data);
            //console.log(vouchData);
            if (vouchData.status == false) {
                let alert_2 = this.showAlert(vouchData.error);
            }
            else {
                this.vouchCountList[proj_Id] = vouchData.count;
                //console.log(" vouch count", this.vouchCountList[mil_Id]);
            }
        }, error => {
            let alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => { 
            //console.log("Finished! " + this.feedData); 
        });
    }
    
    viewMilestone  (feedId) {
        this.nav.push(MilestonePage, { id: feedId }).then((data) => {
            //console.log(data, " viewmil data");
        }).catch(()=>{
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
    showPicture(picUrl){
        this.photoViewer.show(picUrl);
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
        }).catch(()=>{
        });
    };
 
    // create a new post
    createPost = () => {
        this.nav.push(NewPostPage);
    };
  createPicture = () => {
       // this.takePicture();
    };
    /*
    takePicture (){ 
          Camera.getPicture({
            destinationType:  Camera.DestinationType.DATA_URL,
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
    */
    
}
