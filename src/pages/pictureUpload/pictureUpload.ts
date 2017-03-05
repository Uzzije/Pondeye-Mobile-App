import {Component} from '@angular/core';
import {NavController, ActionSheetController, NavParams, LoadingController, AlertController,  Platform} from 'ionic-angular';

import {PostService} from '../../services/post-service';
import {PostPage} from "../post/post";
import {UserPage} from "../user/user";
import {NewPostPage} from "../new-post/new-post";
import {Camera} from 'ionic-native';
import {PictureUploadService} from '../../services/pictureUploadService';
import {SearchResultPage} from '../search-result-page/search-result-page';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
declare var window: any;
@Component({
  selector: 'page-picture-upload',
  templateUrl: 'pictureUpload.html',
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
  private milestoneListData;
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
        
        var subcription = this.picUploadService.getMilestonePostData().subscribe((data) => {
            this.milestoneListData = JSON.parse(data);
            //console.log(this.milestoneListData);
            if (this.milestoneListData.status) {
                this.milPicture = this.milestoneListData.milestone;
            }
            else {
                var alert_1 = this.showAlert(this.milestoneListData.error);
            }
        }, (error) => {
            console.log(error);
            this.loader.dismiss();
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => {
            console.log("Finished! " + this.milestoneListData);
            this.loader.dismiss();
        });
    };
   createMilPictureUpload() {
       
        this.fileUpload = this.base64Image;
        //console.log('file uploda ', this.fileUpload);
        if (this.type_of_picture && this.fileUpload, this.milId) {
            var subscribe = this.picUploadService.milPictureUpload(this.fileUpload, this.type_of_picture, this.milId);
            subscribe.subscribe((data) => {
                this.milestoneListData = JSON.parse(data);
                if (this.milestoneListData.status === false) {
                    var alert_2 = this.showAlert(this.milestoneListData.error);
                }
                else {
                    this.showToast("Picture Uploaded!");
                    this.nav.pop();
                }
            }, (error) => {
                console.log(error);
                var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
            }, () => { return console.log("Finished! "); });
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
            destinationType:  Camera.DestinationType.FILE_URI,
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
