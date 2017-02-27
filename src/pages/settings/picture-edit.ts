import {Component} from '@angular/core';
import {NavController, ActionSheetController, LoadingController, AlertController,  Platform} from 'ionic-angular';

import {PostService} from '../../services/post-service';
import {PostPage} from "../post/post";
import {UserPage} from "../user/user";
import {NewPostPage} from "../new-post/new-post";
import {Camera} from 'ionic-native';
import {NewPostServices} from '../../services/new-post-service';
import {SettingsService} from '../../services/settings-service';
import {NewPictureUploadPage} from '../pictureUpload/pictureUpload'
import {SearchResultPage} from '../search-result-page/search-result-page';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
declare var window: any;
@Component({
  selector: 'picture-edit-page',
  templateUrl: 'picture-edit.html',
})
export class PictureEditPage {
    constructor(private nav: NavController,  private setService: SettingsService, private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public alertCtrl: AlertController, public newPostService: NewPostServices) {
            // set sample data
   
            this.loader = loadingCtrl.create({
            content: "Getting ponders fitness activities...",
            });
            this.loader.present();
   }
  private loader: any;
  private queryWord = "";
  private pictureSetData;
  private picSetList;
  private hasSet;
  private base64Image;
  ngOnInit(): void {
        
        var subcription = this.setService.getPictureEditData().subscribe((data) => {
            this.pictureSetData = JSON.parse(data);
            if (this.pictureSetData.error == false) {
                var alert_1 = this.showAlert(this.pictureSetData.error);
            }
            else {
                this.picSetList = this.pictureSetData.user_picture_set;
                for (var one = 0; one < this.picSetList.length; one++) {
                    console.log(this.picSetList[one]);
                }
                this.hasSet = this.pictureSetData.has_set;
            }
        }, (error) => {
            console.log(error);
            this.loader.dismiss();
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => {
            console.log("Finished! ");
            this.loader.dismiss();
        });
    }

    updatePictureSetBefore = function (picId) {
        
        this.fileUpload = this.base64Image;
        var subcribe = this.setService.updatePictureSetBefore(picId, this.fileUpload).subscribe((data) => {
            this.pictureSetData = JSON.parse(data);
            if (this.pictureSetData.status === false) {
                var alert_2 = this.showAlert(this.pictureSetData.error);
            }
            else {
                this.showToast("Picture Set Updated!");
                this.picSetList = this.pictureSetData.user_picture_set;
            }
        }, (error) => {
            console.log(error);
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => { return console.log("Finished! "); });
    }

    search = function (ev) {
        var queryWord = ev.target.value;
        if (queryWord.length > 0) {
            this.nav.setRoot(SearchResultPage, { queryWord: queryWord });
            console.log(this.queryWord, " query word");
        }
    }

    deletePictureSetBefore = function (picId) {
        
        this.fileUpload = this.base64Image;
        var subcribe = this.setService.deletePictureSetBefore(picId, this.fileUpload).subscribe((data) => {
            this.pictureSetData = JSON.parse(data);
            if (this.pictureSetData.status === false) {
                var alert_3 = this.showAlert(this.pictureSetData.error);
            }
            else {
                this.showToast("Picture Set Updated!");
            }
        }, (error) => {
            console.log(error);
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => { return console.log("Finished! "); });
    }

    deletePictureSetAfter = function (picId) {
        
        this.takePicture();
        this.fileUpload = this.base64Image;
        var subcribe = this.setService.deletePictureSetAfter(picId, this.fileUpload).subscribe((data) => {
            this.pictureSetData = JSON.parse(data);
            if (this.pictureSetData.status === false) {
                var alert_4 = this.showAlert(this.pictureSetData.error);
            }
            else {
                this.showToast("Picture Set Updated!");
            }
        }, (error) => {
            console.log(error);
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => { return console.log("Finished! "); });
    };
    deletePictureSet = function (picSetId) {
        
        var subcribe = this.setService.deletePictureSet(picSetId).subscribe((data) => {
            this.pictureSetData = JSON.parse(data);
            if (this.pictureSetData.status === false) {
                var alert_5 = this.showAlert(this.pictureSetData.error);
            }
            else {
                this.hideMilView(picSetId);
                this.showToast("Picture Set deleted");
            }
        }, (error) => {
            console.log(error);
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => { return console.log("Finished! "); });
    };
    hideMilView = function (picSetId) {
        for (var el = 0; el < this.picSetList.length; el++) {
            if (this.picSetList[el].id == picSetId) {
                this.picSetList[el].hidden == true;
                break;
            }
        }
    };
    updatePictureSetAfter = function (picId) {
        this.takeEditPicture(picId);
    };
    showAlert = function (mes) {
        var alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: mes,
            buttons: ['OK']
        });
        alert.present();
    };
    showToast = function (mes) {
        this.platform.ready().then(() => {
            window.plugins.toast.show(mes, "short", "top");
        });
    };
    takeEditPicture = function (picId) {
        
            Camera.getPicture({
            destinationType: Camera.DestinationType.DATA_URL,
            mediaType: Camera.MediaType.PICTURE,
            encodingType: Camera.EncodingType.JPEG,
            correctOrientation: true
        }).then((imageData) => {
            this.base64Image = "data:image/jpeg;base64," + imageData;
            this.fileUpload = this.base64Image;
            var subcribe = this.setService.updatePictureSetAfter(picId, this.fileUpload).subscribe((data) => {
                this.pictureSetData = JSON.parse(data);
                if (this.pictureSetData.status === false) {
                    var alert_6 = this.showAlert(this.pictureSetData.error);
                }
                else {
                    this.showToast("Picture Set Updated");
                }
            }, (error) => {
                console.log(error);
                var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
            }, () => { return console.log("Finished! "); });
        }, function (err) {
            console.log(err);
        });
    };
    // create a new post
    createPost = () => {
        this.nav.push(NewPostPage);
    };
    createPicture = () => {
        this.takePicture();
    };
     takePicture (){ 
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
    }
    
}