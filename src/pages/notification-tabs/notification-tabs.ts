import {Component} from '@angular/core';
import {UserPage} from '../user/user';
import {AboutPage} from '../about/about';
import {ActivityPage} from '../activity/activity';
import {NotificationsPage} from '../notifications/notifications';
import {FriendRequestPage} from '../friend-request/friend-request';
import {ChallengeActivityPage} from '../challenge-activity/challenge-activity';
import {ChallengeRequestPage} from '../challenge-request/challenge-request';
import {SearchResultPage} from '../search-result-page/search-result-page';
import { File } from '@ionic-native/file';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions} from '@ionic-native/media-capture';
import {NavController,  NavParams, ActionSheetController, LoadingController, AlertController,  Platform} from 'ionic-angular';
import {NewPictureUploadPage} from '../pictureUpload/pictureUpload';
import {NewPostPage} from "../new-post/new-post";
@Component({
  selector: 'notification-tabs',
  templateUrl: 'notification-tabs.html',
  providers:[File, MediaCapture]
})
export class NotificationTabPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  notif1Root: any = FriendRequestPage;
  notif2Root: any = ChallengeActivityPage;
  notif3Root: any = ChallengeRequestPage;
  private videoData;
  private vidDir;
  private vidStorage; 
  constructor(private nav: NavController, public platform: Platform, 
    private fileReader: File, private mediaCapture: MediaCapture,
    public alertCtrl: AlertController,) {

  }
  viewFriendRequest(){
    this.nav.push(FriendRequestPage);
  }
  viewChallengeActivity(){
    this.nav.push(ChallengeActivityPage);
  }
  viewChallengeRequest(){
    this.nav.push(ChallengeRequestPage);
  }
  
  search (ev) {
        var queryWord = ev.target.value;
        if (queryWord.length > 0) {
            this.nav.push( SearchResultPage, { queryWord: queryWord });
           // console.log(this.queryWord, " query word");
        }
    }
    
    // create a new post
    createPost (){ 
          this.nav.push(NewPostPage);
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

}
