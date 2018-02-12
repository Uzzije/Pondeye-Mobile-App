import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ActionSheetController, LoadingController, AlertController,  Platform} from 'ionic-angular';
import {Camera} from '@ionic-native/camera';
import {NewPostServices} from '../../services/new-post-service';
import {MilestonePage} from '../milestone-page/milestone-page';
import {ProjectPage} from '../project-page/project-page';
import {SearchResultPage} from '../search-result-page/search-result-page';
import {VideoUploadModalPage} from '../videoUploadModal/videoUploadModal';
import {CommonModule} from '@angular/common';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions} from '@ionic-native/media-capture';
import { File } from '@ionic-native/file';
import { Ionic2RatingModule } from 'ionic2-rating';
import {PostService} from '../../services/post-service';
import {NewPostPage} from "../new-post/new-post";
import { ModalController } from 'ionic-angular';
import {ActivityPage} from '../activity/activity';
import { PictureUploadService } from '../../services/pictureUploadService';
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the EntryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var window: any;
@IonicPage()
@Component({
  selector: 'page-entry',
  templateUrl: 'entry.html',
  providers:[File, MediaCapture]
})
export class EntryPage {
  private myVideo;
  private videoData;
  private vidDir;
  private vidStorage; 
  private projId;
  private nameOfProgress: any;
  private progMembersList: any;
  private shoutOuts: any;
  private fileUpload: any;
  private isVideoUpload: any;
  private loader: any;
  private progressListData: any;

  constructor(public nav: NavController, public navParams: NavParams,
              public modalCtrl: ModalController, private toastCtrl: ToastController,
              private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public picUploadService: PictureUploadService,
              private fileReader: File, private mediaCapture: MediaCapture,
              public alertCtrl: AlertController, public newPostService: NewPostServices) {
                this.switchTabs();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EntryPage');
  }

  openModal(){
    let myModal = this.modalCtrl.create(VideoUploadModalPage);
    myModal.onDidDismiss(data=>{
      this.projId = data.projId;
      this.nameOfProgress = data.nameOfProgress;
      this.progMembersList = data.progMembersList;
      this.shoutOuts = data.shoutOuts;
      this.createVideoUpload();
      console.log("Still doing something here");
      this.nav.setRoot(ActivityPage);
    }, )
    myModal.present();
  }


  record(){
          
      let videoOptions = {
          number: 1,
          duration: 3,
          height:1080,
          width:1080
      }
      let options: CaptureImageOptions = { limit: 3 };
      var captureVid = this.mediaCapture.captureVideo(videoOptions);
      this.loader = this.loadingCtrl.create({
        content:  "One sec..",
      });
      captureVid.then((vidData: MediaFile[])=>{
        this.loader.present();
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
          
          vidpromise.then((data)=>{
              /*
              console.log(this.vidDir);
              console.log(this.vidStorage[0].name);
              console.log(data);
              */
              let base64Video = data;
              //this.fileReader.removeFile(this.vidDir, this.vidStorage[0].name);
              this.fileUpload = base64Video;
              this.isVideoUpload = true;
              console.log("reaching here");
              this.loader.dismiss();
              this.openModal();
              // this.nav.push(NewPictureUploadPage, { 'fileName': base64Video, 'isVideo':true });
              }, error=>{
                  console.log(error);
                  this.loader.dismiss();
              }).catch(function(err: CaptureError){
                  console.log(err);
                  console.log("error in capturing information");
                  this.loader.dismiss();
              })
      }, error=>{
          console.log(error);
          this.loader.dismiss();
      }
      ).catch(function(err: CaptureError){
          console.log(err);
          console.log("error in capturing information");
          this.loader.dismiss();
      })
      /*
      let videoFile = File.createFromFileName(this.videoData);
      let reader = new FileReader();
      reader.readAsBinaryString(videoFile);
      blah
      console.log('base64Video ', base64Video);
      */
    }

        // create a new post
    createPost (){ 
      this.nav.push(NewPostPage);
    }

    switchTabs() {
      this.nav.parent.select(2);
  }

  createVideoUpload() {
    //console.log('file uploda ', this.fileUpload);
    if (this.projId && this.fileUpload && this.nameOfProgress) {
        this.loader = this.loadingCtrl.create({
                content:  "Creating New Progress..",
        });
        if(this.isVideoUpload){
                //this.loader.present();
                this.showToast("Upload will be ready shortly!");
                var subscribe = this.picUploadService.progressVideoUpload(this.fileUpload, 
                                this.projId, this.nameOfProgress, this.progMembersList, this.shoutOuts); 
                subscribe.subscribe((data) => {
                    this.progressListData = JSON.parse(data);
                    //this.loader.dismiss();
                    if (this.progressListData.status === false) {
                        var alert_2 = this.showAlert(this.progressListData.error);
                    }
                    else {
                        this.showToast("Progress Created!");
                        //this.nav.setRoot(ActivityPage);
                    }
                }, (error) => {
                    //this.loader.dismiss();
                    console.log(error);
                    var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
                }, () => { 
                    console.log("Finished! "); 
                    //this.loader.dismiss();  
            });
        }
    }else{
        this.showAlert("Make sure you select a goal and describe what happened!");
    }
};

showAlert(mes) {
  let alert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: mes,
      buttons: ['OK']
  });
  alert.present();
}

showToast  (mess) {
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
}
