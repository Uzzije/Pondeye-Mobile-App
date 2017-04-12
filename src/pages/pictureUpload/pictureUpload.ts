import {Component} from '@angular/core';
import {NavController, ActionSheetController, NavParams, LoadingController, AlertController,  Platform} from 'ionic-angular';

import {PostService} from '../../services/post-service';
import {PostPage} from "../post/post";
import {UserPage} from "../user/user";
import {NewPostPage} from "../new-post/new-post";
import {Camera} from 'ionic-native';
import {PictureUploadService} from '../../services/pictureUploadService';
import {SearchResultPage} from '../search-result-page/search-result-page';
import {ActivityPage} from '../activity/activity';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
declare var window: any;
@Component({
  selector: 'page-picture-upload',
  templateUrl: 'progressUpload.html',
})

export class NewPictureUploadPage {
  // list of posts
  private feeds = [];
  private vouchCountList = [];
  private followCountList = [];
  private idList = [];
  private queryWord = "";
  private loader: any;
  private base64Image;
  private type_of_picture = "";
  private fileUpload = "";
  private milPicture = "";
  private milId = "";
  private nameOfProgress = "";
  private progressListData;
  private projId;
  private projects;
  private hasProj;
  // set sample data
  constructor(private nav: NavController,  private params: NavParams, private picUploadService: PictureUploadService, 
              private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public alertCtrl: AlertController) {
    // set sample data
    this.base64Image = this.params.get('fileName');
    this.loader = loadingCtrl.create({
      content:  "Uploading Picture..",
    });
      this.loader.present();
  }
   ngOnInit(): void {
        
        var subcription = this.picUploadService.getProgressPostData().subscribe((data) => {
            this.progressListData = JSON.parse(data);
            //console.log(this.progressListData);
            if (this.progressListData.status) {
                this.milPicture = this.progressListData.progress;
                this.projects = this.progressListData.projects;
                this.hasProj = true;
            }
            else {
                var alert_1 = this.showAlert(this.progressListData.error);
                this.hasProj = false;
            }
        }, (error) => {
            console.log(error);
            this.loader.dismiss();
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => {
            console.log("Finished! " + this.progressListData);
            this.loader.dismiss();
        });
    };
   createMilPictureUpload() {
       
        this.fileUpload = this.base64Image;
        //console.log('file uploda ', this.fileUpload);
        if (this.projId && this.fileUpload) {
            this.loader = this.loadingCtrl.create({
                    content:  "Creating New Progress..",
            });
            this.loader.present();
            var subscribe = this.picUploadService.progressPictureUpload(this.fileUpload, this.projId, this.nameOfProgress);
            subscribe.subscribe((data) => {
                this.progressListData = JSON.parse(data);
                this.loader.dismiss();
                if (this.progressListData.status === false) {
                    var alert_2 = this.showAlert(this.progressListData.error);
                }
                else {
                    this.showToast("Progress Created!");
                    this.nav.setRoot(ActivityPage);
                }
            }, (error) => {
                this.loader.dismiss();
                console.log(error);
                var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
            }, () => { 
                console.log("Finished! "); 
                this.loader.dismiss();  
          });
        }else{
            this.showAlert("Make sure you select a goal!");
        }
    };
    // create a new post
   createPost = () => {
        this.nav.push(NewPostPage);
    };
   createPicture = () => {
        this.takePicture();
    };
    showAlert(mes) {
        let alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: mes,
            buttons: ['OK']
        });
        alert.present();
    }
   
    search (ev) {
        var queryWord = ev.target.value;
        if (queryWord.length > 0) {
            this.nav.push( SearchResultPage, { queryWord: queryWord });
            //console.log(this.queryWord, " query word");
        }
    }
    showToast  (mes) {
        this.platform.ready().then(() => {
            window.plugins.toast.show(mes, "short", "top");
        });
    };
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
}
