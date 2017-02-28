import {Component, OnInit} from '@angular/core';
import {NavController, ActionSheetController, LoadingController, AlertController,  Platform} from 'ionic-angular';

import {PostService} from '../../services/post-service';
import {PostPage} from "../post/post";
import {UserPage} from "../user/user";
import {NewPostPage} from "../new-post/new-post";
import {Camera} from 'ionic-native';
import {NewPostServices} from '../../services/new-post-service';
import {MilestonePage} from '../milestone-page/milestone-page';
import {ProjectPage} from '../project-page/project-page';
import {SearchResultPage} from '../search-result-page/search-result-page';
import {NewPictureUploadPage} from '../pictureUpload/pictureUpload';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})
export class ActivityPage implements OnInit {
  // list of posts
  private feeds = [];
  private  vouchCountList = [];
  private followCountList = [];
  private idList = [];
  private queryWord = "";
  private loader: any;
  private base64Image;
  private hasFeed = false;
  private nextFeed;
  private nextId;
  private feedData;
  // set sample data
  constructor(private nav: NavController,  private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public alertCtrl: AlertController, public newPostService: NewPostServices) {
    // set sample data
    this.followCountList[0] = "say";
   console.log(this.followCountList, + "list follow");
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
                console.log("feed length ", this.feeds.length);
                for (var item = 0; item < this.feeds.length; item++) {
                    this.nextFeed = this.feeds[item];
                    this.nextId = this.nextFeed.id;
                    if (this.nextFeed.is_milestone_feed) {
                        this.vouchCountList[this.nextId] = this.nextFeed.vouch_count;
                    }
                    if (this.nextFeed.is_project_feed) {
                        
                        this.followCountList[this.nextId] = this.nextFeed.follow_count;
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

    createVouch (mil_Id) {
        console.log("create vouch id ", mil_Id);
        this.postService.postNewVouch(mil_Id).subscribe(data => {
            var vouchData = JSON.parse(data);
            console.log(vouchData);
            if (vouchData.status == false) {
                let alert_2 = this.showAlert(vouchData.error);
            }
            else {
                this.vouchCountList[mil_Id] = vouchData.count;
                console.log(" vouch count", this.vouchCountList[mil_Id]);
            }
        }, error => {
            let alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => { return console.log("Finished! " + this.feedData); });
    }

    createFollow (proj_Id){
        this.postService.postNewFollow(proj_Id).subscribe(data => {
            var followData = JSON.parse(data);
            console.log(followData);
            if (followData.status == false) {
                let alert_3 = this.showAlert(followData.error);
            }
            else {
                this.followCountList[proj_Id] = followData.count;
            }
        }, error => {
            let alert = this.showAlert("Oops. Something Went Wrong! Check your connection!");
        }, () => { return console.log("Finished! " + this.feedData); });
    }

    viewMilestone (feedId) {
        this.nav.push(MilestonePage, { id: feedId });
        console.log(feedId, " feed id");
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
            console.log(this.queryWord, " query word");
        }
    }
    // on click, go to user timeline
    viewUser (userId) {
        this.nav.push( UserPage, { id: userId });
    }
    viewProfile(id) {
        this.nav.push( UserPage, { id: id });
    }
    // create a new post
    createPost (){ 
        this.nav.push(NewPostPage);
    }
    createPicture (){ 
        this.takePicture();
    }
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
