import {Component, NgModule} from '@angular/core';
import {NavController, ActionSheetController, LoadingController, AlertController,  Platform} from 'ionic-angular';

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
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@NgModule({
    imports: [
        CommonModule,
    ]
})
@Component({
  selector: 'page-activity',
  templateUrl: 'activity_video.html',
  providers:[File, MediaCapture]
})
export class ActivityPage  {
  // list of posts
  private feeds = [];
  private  vouchCountList = [];
  private followCountList = [];
  private idList = [];
  private impressCountList = [];
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
  // set sample data
  constructor(private nav: NavController,  private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, private fileReader: File, private mediaCapture: MediaCapture,
              public alertCtrl: AlertController, public newPostService: NewPostServices) {
    // set sample data
    this.followCountList[0] = "say";
   //console.log(this.followCountList, + "list follow");
    this.loader = loadingCtrl.create({
      content: "Getting ponders fitness activities...",
    });
      this.loader.present();
  }
    ngOnInit (): void {
        
        var subcription = this.postService.getUserFeed().subscribe(data => {
            
            this.feedData = JSON.parse(data);
            //console.log(this.feedData);
            if (this.feedData.status == false) {
                let alert = this.showAlert(this.feedData.error);
               
            }
            this.feeds = this.feedData.all_feeds;
            if (this.feeds) {
                this.hasFeed = true;
                //console.log("feed length ", this.feeds.length);
                for (var item = 0; item < this.feeds.length; item++) {
                    this.nextFeed = this.feeds[item];
                    this.nextId = this.nextFeed.id;
                    if(this.nextFeed.is_project_feed){
                        this.vouchCountList[this.nextId] = this.nextFeed.vouch_count;
                        this.followCountList[this.nextId] = this.nextFeed.follow_count;
                    }
                    if(this.nextFeed.is_progress_feed){
                        console.log("next progr ", this.nextFeed.list_of_progress.length);
                        for(var prog = 0; prog < this.nextFeed.list_of_progress.length; prog++){
                            var progress = this.nextFeed.list_of_progress[prog];
                            this.impressCountList[progress.id] = progress.impress_count;
                        } 
                    }
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
    showPicture(picUrl){
        
    }
    record(){
        
        let videoOptions = {
            number: 1,
            duration: 10,
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
            let videoPromise = this.fileReader.readAsDataURL(this.vidDir, this.vidStorage[0].name);
            return videoPromise;
        }).then((data)=>{
            console.log(this.vidDir);
            console.log(this.vidStorage[0].name);
            console.log(data);
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
        /*
        }, error=>{
            console.log(error);
        }
        ).catch(function(err: CaptureError){
            console.log(err);
            console.log("error in capturing information");
        })
    
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

        setTimeout(() => {
        console.log('Async operation has ended');
        refresher.complete();
        }, 2000);
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

    createFollow (proj_Id){
        this.postService.postNewFollow(proj_Id).subscribe(data => {
            var followData = JSON.parse(data);
            //console.log(followData);
            if (followData.status == false) {
                let alert_3 = this.showAlert(followData.error);
            }
            else {
                this.followCountList[proj_Id] = followData.count;
            }
        }, error => {
            let alert = this.showAlert("Oops. Something Went Wrong! Check your connection!");
        }, () => { 
            //console.log("Finished! " + this.feedData); 
        });
    }

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
