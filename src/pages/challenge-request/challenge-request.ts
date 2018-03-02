import { Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ActionSheetController, AlertController, Platform } from 'ionic-angular';
import {PondService} from '../../services/pond-service';
import {UserPage} from "../user/user";
import {ProjectService} from '../../services/project-service';

/**
 * Generated class for the ChallengeRequestPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var window: any;
@IonicPage()
@Component({
  selector: 'page-challenge-request',
  templateUrl: 'challenge-request.html',
})
export class ChallengeRequestPage implements OnInit {

  
  private loader: any;
  private feedData: any;
  private chFeeds = [];
  private hasFeed: any;
  private nextFeed: any;
  private nextId: any;
  private challengeList = [];
  private chFeed = [];
  private feeds = [];
  private hasRequest = false;
  constructor(public navCtrl: NavController, public loadingCtrl: 
              LoadingController, public projectService: ProjectService,
              public actionSheetCtrl: ActionSheetController,
              public platform: Platform,
              public alertCtrl: AlertController, 
              public navParams: NavParams, private pondService: PondService) {

  }

  ngOnInit(): void {
   this.loadRequest();  
    //console.log("initiated");
    //console.log("slaya man"); console.log(this.feeds);
  }

  rejectChallenge(chId){
    var subscribe = this.projectService.acceptChallengeRequest(chId);
    subscribe.subscribe( (data) => {
        var statusData = JSON.parse(data);
        if (statusData.status === false) {
            var alert_5 = this.showAlert(statusData.error);
        }
        else {
            this.chFeed[chId] = false;
            this.showToast("Challenge Rejected!");
        }
    }, (error) => { 
        alert(error); }, 
        () => 
            { 
            console.log("Finished! "); 
    });
  }

  verifyAcceptChallenge(chiId){
    let alert = this.alertCtrl.create({
        title: 'Confirm Accepted Challenge',
        message: 'Are you sure you want to accept this challenge?',
        buttons: [
            {
                text: 'No',
                role: 'cancel',
                handler: () => {
                    //this.showToast("Can't wait till it's done!");
                }
            },
            {
                text: "Yep!",
                handler: () => {
                  this.acceptChallenge(chiId);
                  this.showToast("Can't wait till it's done!");
                }
            }
        ]
    });
    alert.present();
  }

  verifyrejectChallenge(projId){
    let alert = this.alertCtrl.create({
        title: 'Confirm Reject Challenge',
        message: 'Are you sure you want to reject this challenge?',
        buttons: [
            {
                text: 'No',
                role: 'cancel',
                handler: () => {
                    //
                }
            },
            {
                text: "Yep!",
                handler: () => {
                  this.rejectChallenge(projId);
                  this.showToast("Challenge request rejected!");
                }
            }
        ]
    });
    alert.present();
  }

  acceptChallenge(id){
    var subscribe = this.projectService.acceptChallengeRequest(id);
    subscribe.subscribe( (data) => {
        var statusData = JSON.parse(data);
        if (statusData.status === false) {
            var alert_5 = this.showAlert(statusData.error);
        }
        else {
            this.showToast("Challenge Accepted!");
            this.chFeed[id] = false;
        }
    }, (error) => { 
        alert(error); }, 
        () => 
            { 
            console.log("Finished! "); 
    });
  }
  showToast  (mes) {
      this.platform.ready().then(() => {
          window.plugins.toast.show(mes, "short", "top");
      }).catch(()=>{
      });
  };


  loadRequest(){
    this.loader = this.loadingCtrl.create({
        content: "Getting challenge requests...",
      });
    this.loader.present();
    var subcription = this.projectService.getChallengeRequest().subscribe(data => {
            
      this.feedData = JSON.parse(data);
      if (this.feedData.status == false) {
          let alert = this.showAlert(this.feedData.error);
      }else{

        this.feeds = this.feedData.requests;
        console.log(this.chFeeds);
        if (this.chFeeds) {
            this.hasFeed = true;
            //console.log("feed length ", this.feeds.length);
            this.hasRequest = this.feeds.length > 0;
            for (var item = 0; item < this.feeds.length; item++) {
                this.nextFeed = this.feeds[item];
                console.log("next feed"); console.log(this.nextFeed);
                var chId = this.nextFeed.ch_id;
                this.chFeed[chId] = true;
                //this.chFeeds = this.nextFeed.created;
                //this.feeds.push(this.nextFeed);
            }
            console.log("feed here, :"); console.log(this.nextFeed.created);
        }
    }
      this.loader.dismiss();
    }, error => {
        this.loader.dismiss();
        console.log("feed here, :");
        let alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
    }, () => {
        console.log("Finished! ");
        this.loader.dismiss();
    });
    this.loader.dismiss();
  }


  showAlert(mes) {
    let alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: mes,
        buttons: ['OK']
    });
    alert.present();
  }

}
