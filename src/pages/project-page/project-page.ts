import {Component} from '@angular/core';
import {IonicPage, NavController, ActionSheetController, NavParams, LoadingController, AlertController,  Platform} from 'ionic-angular';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
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
import {UserService} from '../../services/user-service';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

declare var window: any;
@IonicPage()
@Component({
  selector: 'project-page',
  templateUrl: 'project-page.html',
  providers:[PhotoViewer, StreamingMedia]
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
    private followCountList = [];
    private commentCountList = [];
    private recentUploadUrl;
    private recentUploadSeenViews;
    private projectName;
    private recentCommentList = []
    private projectCommentList = [];
    private isGoalOwner;
    private tags = [];
    private isCompleted;
    private isFailed;
    private impressCountListH = [];
    private impressHighlightCountList = [];
    private viewRecentCountList = [];
    private impressRecentCountList = [];
    private hasHighlight;
    private viewCountListH = [];
    private hasRecent;
    private highlightUrl;
    private showProj;
    private progress;
    constructor(private nav: NavController,  private params: NavParams, private setService: SettingsService, 
              private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, private streamingMedia: StreamingMedia, 
              private photoViewer: PhotoViewer, private userService: UserService,
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
                if(this.projData.tags.length == 0){
                    this.noMotif = true;
                }
                // comments from most recent upload
                // Name of Challenge
                // Impressed by Recent Upload
                // Following challenge
                // Comments of Project
                // Most Recent Video Url
                // Most Recent Video views
                // 
                this.projectCommentList = this.projData.project_comments;
                this.recentCommentList = this.projData.recent_comments;
                this.projectName = this.projData.project_name;
                this.impressCountList = this.projData.recent_impress_count;
                this.recentUploadUrl = this.projData.ru_upload_url;
                this.highlightUrl = this.projData.high_upload_url;
                this.recentUploadSeenViews = this.projData.ru_upload_views;
                this.isGoalOwner = this.projData.is_goal_owner
                this.tags = this.projData.tags;
                this.projID = this.projData.proj_id;
                this.hasHighlight = this.projData.has_highlight;
                this.hasRecent = this.projData.has_recent;
                this.followCountList[this.projData.id] = this.projData.follow_count;
                this.showProj = this.projData.cc_proj_began;
                this.progress = this.projData.progress_list;
                if(this.hasHighlight){
                    this.impressHighlightCountList[this.projData.progress_set_id] = this.projData.highlight_impress_count;
                    this.viewCountListH[this.projData.progress_set_id] = this.projData.highlight_view_count;
                }
                if(this.hasRecent){
                    console.log("Has recent");
                    this.viewRecentCountList[this.projData.progress_id] = this.recentUploadSeenViews;
                    this.impressRecentCountList[this.projData.progress_id] = this.impressCountList;
                }
            }
            this.loader.dismiss();
        }, (error) => { this.loader.dismiss(); var alert = this.showAlert(error); }, () => {
            console.log("Finished! ");
            this.loader.dismiss();
        });
    };
   
    playHighlightVideo(video_url, progress_set_id){
        let options: StreamingVideoOptions = {
            successCallback: () => { console.log('Video played') },
            errorCallback: (e) => { console.log('Error streaming') },
            orientation: 'landscape'
        };
        this.streamingMedia.playVideo(video_url);
        this.incrementSeenH(progress_set_id);
    }
    playRecentUploadVideo(video_url, progress_id){
        let options: StreamingVideoOptions = {
            successCallback: () => { console.log('Video played') },
            errorCallback: (e) => { console.log('Error streaming') },
            orientation: 'landscape'
        };
        this.streamingMedia.playVideo(video_url);
        this.incrementSeen(progress_id);
    }



    markProjectDone (projId) {
        var subscribe = this.userService.markProjectDone(projId);
        subscribe.subscribe((data) => {
            var statusData = JSON.parse(data);
            if (statusData.status === false) {
                var alert_3 = this.showAlert(statusData.error);
            }
            else {
                this.showToast("Completion Noted!");
            }
        }, (error) => { 
            alert(error); 
        }, () => { 
            console.log("Finished! "); 
        });
      };

    verifyProjDone(projId){
        let alert = this.alertCtrl.create({
            title: 'Confirm Completed Goal',
            message: 'Are you sure you want to mark this goal as completed?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        this.showToast("Can't wait till it's done!");
                    }
                },
                {
                    text: "Yep!",
                    handler: () => {
                        this.markProjectDone (projId);
                        this.showToast("Highlight video will be ready shortly!");
                        this.showProj = false;
                    }
                }
            ]
        });
        alert.present();
    }
    
    createFollow (nextId){
        this.postService.postNewFollow(nextId).subscribe(data => {
            var followData = JSON.parse(data);
            //console.log(followData);
            if (followData.status == false) {
                let alert_3 = this.showAlert(followData.error);
            }
            else {
                this.followCountList[nextId] = followData.count;
            }
        }, error => {
            let alert = this.showAlert("Oops. Something Went Wrong! Check your connection!");
        }, () => { 
            //console.log("Finished! " + this.feedData); 
        });
    }

    createHighlightImpression(projId){
        this.postService.postNewHighlightImpression(projId).subscribe(data => {
            var impressData = JSON.parse(data);
            //console.log(followData);
            if (impressData.status == false) {
                let alert_3 = this.showAlert(impressData.error);
            }
            else {
                this.impressHighlightCountList[projId] = impressData.count;
            }
        }, error => {
            let alert = this.showAlert("Oops. Something Went Wrong! Check your connection!");
        }, () => { 
            //console.log("Finished! " + this.feedData); 
        });
    }
    
    createRecentImpression(projId){
        this.postService.postNewRecentUploadImpression(projId).subscribe(data => {
            var impressData = JSON.parse(data);
            //console.log(followData);
            if (impressData.status == false) {
                let alert_3 = this.showAlert(impressData.error);
            }
            else {
                this.impressRecentCountList[projId] = impressData.count;
            }
        }, error => {
            let alert = this.showAlert("Oops. Something Went Wrong! Check your connection!");
        }, () => { 
            //console.log("Finished! " + this.feedData); 
        });
    }
    
    incrementSeen(progID){
        
        this.postService.postNewRecentUploadImpression(progID).subscribe(data => {
            var seenData = JSON.parse(data);
            //console.log(followData);
            if (seenData.status == false) {
                let alert_3 = this.showAlert(seenData.error);
            }else{
                this.viewRecentCountList[progID] = seenData.count;
            }
        }, error => {
            let alert = this.showAlert("Oops. Something Went Wrong! Check your connection!");
        }, () => { 
            //console.log("Finished! " + this.feedData); 
        });
        
        console.log("Seen By!");
    }
    incrementSeenH(progSetId){
        this.postService.postHighlightUploadNewSeen(progSetId).subscribe(data => {
            var seenData = JSON.parse(data);
            //console.log(followData);
            if (seenData.status == false) {
                let alert_3 = this.showAlert(seenData.error);
            }else{
                this.viewCountListH[progSetId] = seenData.count;
            }
        }, error => {
            let alert = this.showAlert("Oops. Something Went Wrong! Check your connection!");
        }, () => { 
            //console.log("Finished! " + this.feedData); 
        });
        
        console.log("Seen By!");
    }

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

    findTagView(queryWord){
        this.nav.push(SearchResultPage, { tagSearch: queryWord });
    }

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
