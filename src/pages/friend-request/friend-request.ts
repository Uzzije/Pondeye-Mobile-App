import { Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ActionSheetController, AlertController, Platform } from 'ionic-angular';
import {PondService} from '../../services/pond-service';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions} from '@ionic-native/media-capture';
import {UserPage} from "../user/user";
import { File } from '@ionic-native/file';
/**
 * Generated class for the FriendRequestPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var window: any;
@IonicPage()
@Component({
  selector: 'page-friend-request',
  templateUrl: 'friend-request.html',
  providers:[File, MediaCapture]
})
export class FriendRequestPage implements OnInit{

  private loader: any;
  private feedData: any;
  private feeds = [];
  private hasFeed: any;
  private nextFeed: any;
  private nextId: any;
  private friendsList = [];
  private rejectList = []
  constructor(public navCtrl: NavController, public loadingCtrl: 
              LoadingController, 
              public actionSheetCtrl: ActionSheetController,
              public platform: Platform, private fileReader: File, private mediaCapture: MediaCapture,
              public alertCtrl: AlertController, 
              public navParams: NavParams, private pondService: PondService) {
    this.loader = loadingCtrl.create({
      content: "Getting ponders fitness activities...",
    });
      this.loader.present();
  }        
    ngOnInit (): void {
        
        var subcription = this.pondService.getFriendRequest().subscribe(data => {
            
            this.feedData = JSON.parse(data);
            if (this.feedData.status == false) {
                let alert = this.showAlert(this.feedData.error);
            }else{
                this.feeds = this.feedData.requests;
                console.log("feed here, :");console.log(this.feeds.length);
                if (this.feeds) {
                    this.hasFeed = true;
                    //console.log("feed length ", this.feeds.length);
                    for (var item = 0; item < this.feeds.length; item++) {
                        this.nextFeed = this.feeds[item];
                        console.log("next feed"); console.log(this.nextFeed);
                        this.nextId = this.nextFeed.req_id;
                        this.friendsList[this.nextId] = "Add";
                        this.rejectList[this.nextId] = 'Reject'
                    }
            }
        }
            this.loader.dismiss();
        }, error => {
            this.loader.dismiss();
            let alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => {
            console.log("Finished! ");
            this.loader.dismiss();
        });
        this.loader.dismiss();
    }
    acceptFriendRequest (reqId) {
        var subscribe = this.pondService.acceptFriendRequest(reqId);
        subscribe.subscribe( (data) => {
            var statusData = JSON.parse(data);
            if (statusData.status === false) {
                var alert_5 = this.showAlert(statusData.error);
            }
            else {
                this.friendsList[this.nextId] = "Friends";
                this.showToast("Now Friend!");
            }
        }, (error) => { 
            alert(error); }, 
            () => 
                { 
                console.log("Finished! "); 
        });
    }
    rejectFriendRequest(reqId){
        var subscribe = this.pondService.rejectFriendRequest(reqId);
        subscribe.subscribe( (data) => {
            var statusData = JSON.parse(data);
            if (statusData.status === false) {
                var alert_5 = this.showAlert(statusData.error);
            }
            else {
                //this.friendsList[this.nextId] = "Friends";
                this.showToast("Sent Friend Request!");
                this.friendsList[this.nextId] = "Rejected!";
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
    showAlert(mes) {
        let alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: mes,
            buttons: ['OK']
        });
        alert.present();
    }

    viewProfile(id) {
        this.navCtrl.push( UserPage, { id: id });
    }
}
