import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController, AlertController,  Platform } from 'ionic-angular';
import {UserService} from '../../services/user-service';
import {SearchService} from '../../services/search-service';
import {FriendService} from '../../services/friend-service';
import {UserPage} from "../user/user";
import { ToastController } from 'ionic-angular';
/**
 * Generated class for the FriendsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {

  private queryWord = "";
  private loader: any;
  private base64Image;
  private milestones = [];
  private noResult = false;
  private userId;
  // get sample data only
  private projID;
  private resultData;
  private dataResult;
  private showFriend;
  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserService,  private params: NavParams, 
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform, public loadingCtrl: LoadingController, private toastCtrl: ToastController,
    public alertCtrl: AlertController, public searchService: SearchService, public friendService: FriendService) {
    this.userId = this.navParams.get('id');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsPage');
  }


  ngOnInit(): void {
        
    var subcription = this.friendService.getAllFriends(this.userId).subscribe((data) => {
        //console.log("search word ", this.queryWord);
        this.resultData = JSON.parse(data);
        console.log(this.resultData);
        if (this.resultData.status == false) {
            var alert_1 = this.showAlert(this.resultData.error);
        }
        else {
            this.dataResult = this.resultData.result_list;
            if (this.dataResult.length == 0) {
                this.noResult = true;
            }
        }
    }, (error) => {
        console.log(error);
        
        var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
    }, () => {
        console.log("Finished! ");
        
    });
  };

  findFriend (ev) {
    var queryWord = ev.target.value;
    if (queryWord.length > 0) {
        var subcription = this.searchService.getFriendResult(this.queryWord).subscribe((data) => {
          //console.log("search word ", this.queryWord);
          this.resultData = JSON.parse(data);
          if (this.resultData.status == false) {
              var alert_1 = this.showAlert(this.resultData.error);
          }
          else {
              this.dataResult = this.resultData.result_list;
              if (this.dataResult.length == 0) {
                  this.noResult = true;
              }else{
                this.noResult = false;
                console.log(this.noResult);
                console.log("scrum ");
              }
          }
      }, (error) => {
          console.log(error);
          
          var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
      }, () => {
          console.log("Finished! ");
          
      });
    }
  }

  removeFiend(resId){
    let alert = this.alertCtrl.create({
        title: 'Confirm Completed Goal',
        message: 'Are you sure you want to remove this friend?',
        buttons: [
            {
                text: 'No',
                role: 'cancel',
                handler: () => {
                }
            },
            {
                text: "Yep!",
                handler: () => {
                    //this.showFriend[resId] = false;
                    this.removeFriendService(resId);
                }
            }
        ]
    });
    alert.present();
  }
  removeFriendService(resId){

    var subcription = this.friendService.removeFriend(resId).subscribe((data) => {
        //console.log("search word ", this.queryWord);
        //this.resultData = JSON.parse(data);
        // console.log(this.resultData);
        if (this.resultData.status == false) {
            var alert_1 = this.showAlert(this.resultData.error);
        }
        this.showToast("User Removed!");
    }, (error) => {
        console.log(error);
        
        var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
    }, () => {
        console.log("Finished! ");
        
    });
    
  }
  showToast (mess) {
    /*
    this.platform.ready().then(() => {
        window.plugins.toast.show(mes, "short", "top");
    }).catch(()=>{
    });
    */
    this.presentToast(mess);
  };
    presentToast(mess) {
      let toast = this.toastCtrl.create({
        message: mess,
        duration: 3000,
        position: 'top'
      });
  
      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
  
      toast.present();
    }

  viewProfile(id){
    this.navCtrl.push( UserPage, { id: id });
  }
  showAlert  (mes) {
    var alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: mes,
        buttons: ['OK']
    });
    alert.present();
  };

}
