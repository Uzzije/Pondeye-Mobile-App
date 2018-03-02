import {Component, NgModule, ViewChild} from '@angular/core';
import {NavController, ActionSheetController, LoadingController, AlertController,  Content, Platform} from 'ionic-angular';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import {PostService} from '../../services/post-service';
import {PostPage} from "../post/post";
import {UserPage} from "../user/user";
import {NewPostPage} from "../new-post/new-post";
import {Camera} from '@ionic-native/camera';
import {NewPostServices} from '../../services/new-post-service';
import {MilestonePage} from '../milestone-page/milestone-page';
import {ProjectPage} from '../project-page/project-page';
import {SearchResultPage} from '../search-result-page/search-result-page';
import {NewPictureUploadPage} from '../pictureUpload/pictureUpload';
import {CommonModule} from '@angular/common';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions} from '@ionic-native/media-capture';
import { File } from '@ionic-native/file';
import { Ionic2RatingModule } from 'ionic2-rating';
import { enableDebugTools } from '@angular/platform-browser/src/browser/tools/tools';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@NgModule({
    imports: [
        CommonModule,
        Ionic2RatingModule
    ]
})
@Component({
  selector: 'page-activity',
  templateUrl: 'activity_feed.html',
  providers:[File, MediaCapture, StreamingMedia]
})

export class ActivityPage  {
  // list of posts
  @ViewChild(Content) content: Content;
  private feeds = [];
  private  vouchCountList = [];
  private followCountList = [];
  private idList = [];
  private impressCountList = [];
  private impressHighlightCountList = [];
  private impressRecentCountList = [];
  private queryWord = "";
  private loader: any;
  private base64Image;
  private hasFeed = false;
  private nextFeed;
  private nextId;
  private feedData;
  private myVideo;
  private videoData;
  private vidDir;
  private vidStorage; 
  private viewRecentCountList = [];
  private viewCountListH = [];
  private showSpinner = false;
  // set sample data
  constructor(private nav: NavController,  private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, private streamingMedia: StreamingMedia, 
              private fileReader: File, private mediaCapture: MediaCapture,
              public alertCtrl: AlertController, public newPostService: NewPostServices) {
    // set sample data
    this.followCountList[0] = "say";
   //console.log(this.followCountList, + "list follow");
   
    this.loader = loadingCtrl.create({
      content: "Getting ponders fitness activities...",
    });
      this.loader.present();
      this.switchTabs(); 
  }
    ngOnInit (): void {
       this.loadFeed(); 
       console.log("slaya man"); console.log(this.feeds);
    }

    loadFeed(){
        var subcription = this.postService.getUserFeed().subscribe(data => {
            
            this.feedData = JSON.parse(data);
            console.log("feed here, :");
            if (this.feedData.status == false) {
                let alert = this.showAlert(this.feedData.error);
            }
            this.feeds = this.feedData.all_feeds;
            console.log("feed here, :");console.log(this.feeds);
            if (this.feeds) {
                this.hasFeed = true;
                localStorage.setItem('end_range', this.feedData.index);
                localStorage.setItem('per_item', this.feedData.index);
                console.log(localStorage.getItem('end_range'))
                console.log("feed length ", this.feeds.length);
                for (var item = 0; item < this.feeds.length; item++) {
                    this.nextFeed = this.feeds[item];
                    this.nextId = this.nextFeed.id;
                    if(this.nextFeed.is_recent_progress || this.nextFeed.is_video_highlight){
                        this.impressRecentCountList[this.nextFeed.progress_id] = this.nextFeed.impressed;
                        this.viewRecentCountList[this.nextFeed.progress_id] = this.nextFeed.seen;
                    }
                    if(this.nextFeed.is_video_highlight){
                        this.impressHighlightCountList[this.nextFeed.progress_set_id] = this.nextFeed.impressed;
                        this.viewCountListH[this.nextFeed.progress_set_id] = this.nextFeed.seen;
                        
                    }
                    if(this.nextFeed.is_recent_progress || this.nextFeed.is_video_highlight 
                            || this.nextFeed.is_challenge_accept){
                        this.followCountList[this.nextId] = this.nextFeed.follow;
                    }
                    console.log("Nexting id ", this.nextId);
                    this.followCountList[this.nextId] = this.nextFeed.follow;
                }
            }
        }, error => {
            this.loader.dismiss();
            let alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => {
            console.log("Finished! ");
            this.loader.dismiss();
        });
    }
    
    loadMoreItems(){
        this.showSpinner = true;
        console.log("Scroll End!");
        let end = localStorage.getItem('end_range');
        let start_range = parseInt(end);
        let end_range = parseInt(end) + parseInt(localStorage.getItem('per_item'));
        console.log(start_range);
        console.log(end_range);
        localStorage.setItem('end_range', end_range.toString());
        var subcription = this.postService.getNextUserFeed(start_range, end_range).subscribe(data => {
            
            this.feedData = JSON.parse(data);
            //console.log("feed here, :");console.log(this.feeds);
            if (this.feedData.status == false) {
                let alert = this.showAlert(this.feedData.error);
            }
            for (var item = 0; item < this.feedData.all_feeds.length; item++){
                    this.feeds.push(this.feedData.all_feeds[item]);
            }
            //this.feeds = Array.prototype.push.apply(this.feeds, this.feedData.all_feeds);
            

            if (this.feeds) {
                this.hasFeed = true;
                console.log("feed here, :");
                //console.log(this.feeds);
                //console.log("feed length ", this.feeds.length);
                let nextAllFeed = this.feedData.all_feeds;
                console.log(nextAllFeed);
                for (var item = 0; item < nextAllFeed.length; item++) {
                    this.nextFeed = nextAllFeed[item];
                    this.nextId = this.nextFeed.id;
                    if(this.nextFeed.is_recent_progress || this.nextFeed.is_video_highlight){
                        this.impressRecentCountList[this.nextFeed.progress_id] = this.nextFeed.impressed;
                        this.viewRecentCountList[this.nextFeed.progress_id] = this.nextFeed.seen;
                    }
                    if(this.nextFeed.is_video_highlight){
                        this.impressHighlightCountList[this.nextFeed.progress_set_id] = this.nextFeed.impressed;
                        this.viewCountListH[this.nextFeed.progress_set_id] = this.nextFeed.seen;
                        
                    }
                    if(this.nextFeed.is_recent_progress || this.nextFeed.is_video_highlight 
                            || this.nextFeed.is_challenge_accept){
                        this.followCountList[this.nextId] = this.nextFeed.follow;
                    }
                    console.log("Nexting id ", this.nextId);
                    this.followCountList[this.nextId] = this.nextFeed.follow;
                }
            }
            this.showSpinner = false;
        }, error => {
            this.loader.dismiss();
            let alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => {
            console.log("Finished! ");
            this.loader.dismiss();
        });
    }
    showPicture(picUrl){
        
    }
    switchTabs() {
        this.nav.parent.select(1);
    }
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
    record(){
        
        let videoOptions = {
            number: 1,
            duration: 10,
            height:1080,
            width:1080
        }
        let options: CaptureImageOptions = { limit: 3 };
        var captureVid = this.mediaCapture.captureVideo(videoOptions);
        captureVid.then((vidData: MediaFile[])=>{
            var type_of_obj = typeof captureVid;
            this.vidStorage = vidData;
            if(this.platform.is('ios')){
                var name = "/"+this.vidStorage[0].name
                this.vidDir = "file://"+this.vidStorage[0]['fullPath'].replace(name, "");
            }else{
                this.vidDir = this.vidStorage[0]['fullPath'].replace(this.vidStorage[0].name, "")
            }   
            console.log(this.vidDir);
            var vidpromise = this.fileReader.readAsDataURL(this.vidDir, this.vidStorage[0].name);
            console.log(vidpromise);
            vidpromise.then((data)=>{
                /*
                console.log(this.vidDir);
                console.log(this.vidStorage[0].name);
                console.log(data);
                */
                let base64Video = data;
                //this.fileReader.removeFile(this.vidDir, this.vidStorage[0].name);
                console.log("reaching here");
                this.nav.push(NewPictureUploadPage, { 'fileName': base64Video, 'isVideo':true });
                }, error=>{
                    console.log(error);
                }).catch(function(err: CaptureError){
                    console.log(err);
                    console.log("error in capturing information");
                })
        }, error=>{
            console.log(error);
        }
        ).catch(function(err: CaptureError){
            console.log(err);
            console.log("error in capturing information");
        })
        /*
        let videoFile = File.createFromFileName(this.videoData);
        let reader = new FileReader();
        reader.readAsBinaryString(videoFile);
        blah
        console.log('base64Video ', base64Video);
        */
    }
    selectvideo(){
        /*
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
        */
    }
    ngAfterViewInit (){ 
        var idNext;
        this.content.ionScrollEnd.subscribe((data)=>{
            //this.loadMoreItems();
        });
        /*
        $(this.input.nativeElement).find("section").twentytwenty({
              default_offset_pct: 0.9
        });
        this.imgList.changes.subscribe(
          (result) => {
              result.forEach((img_item: ElementRef) => {
                  $(img_item.nativeElement).twentytwenty();
                  
            })
          }
        )
    
        /*
        for(var item = 0; item < this.idList.length; item++){
            idNext = this.idList[item];
            console.log("I acame I saw and conquered!");
    
             $(this.input.nativeElement).find("section").twentytwenty({
              default_offset_pct: 0.9
            });
           // $(this.input.nativeElement).find(".img"+idNext).twentytwenty({
              //default_offset_pct: 0.9
            //});
            
        }
        */
        //this.loader.dismiss();
    }
    ionViewDidLoad () {
        /*
        this.imgList.forEach((img_item: ElementRef) =>{
            $(img_item.nativeElement).twentytwenty({
              default_offset_pct: 0.9
           });
           console.log("I am printing ish out!!");
        })
        */
    }
    showAlert(mes) {
        let alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: mes,
            buttons: ['OK']
        });
        alert.present();
    }

    doRefresh(refresher) {
        console.log('Begin async operation', refresher);
        this.loadFeed();
        setTimeout(() => {
            console.log('Async operation has ended');
            refresher.complete();
        }, 1000);
        
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
    viewMilestone (feedId) {
        this.nav.push(MilestonePage, { id: feedId });
        // console.log(feedId, " feed id");
    }
    /*
    viewPictureSet(feedId){
        this.nav.push(PostPage, {id: feedId});
    }
  */
    viewProject (feedId) {
        this.nav.push(ProjectPage, { id: feedId });
    }
    search (ev) {
        var queryWord = ev.target.value;
        if (queryWord.length > 0) {
            this.nav.push( SearchResultPage, { queryWord: queryWord });
           // console.log(this.queryWord, " query word");
        }
    }
    // on click, go to user timeline
    viewProfile(id) {
        console.log("feed id", id);
        this.nav.push( UserPage, { id: id });
    }
    // create a new post
    createPost (){ 
        this.nav.push(NewPostPage);
    }
   createPicture = () => {
       console.log("picture is called!");
       // this.takePicture();
    };
    incrementSeen(progID){
        
        this.postService.postRecentUploadNewSeen(progID).subscribe(data => {
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
