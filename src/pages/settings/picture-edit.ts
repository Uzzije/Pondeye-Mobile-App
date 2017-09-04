import {Component} from '@angular/core';
import {NavController, ActionSheetController, LoadingController, AlertController,  Platform} from 'ionic-angular';

import {PostService} from '../../services/post-service';
import {PostPage} from "../post/post";
import {UserPage} from "../user/user";
import {NewPostPage} from "../new-post/new-post";
import {Camera} from '@ionic-native/camera';
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
  private fileUpload;
  private showPicture = [];
  private progressSet = [];
  ngOnInit(): void {
        
        var subcription = this.setService.getPictureEditData().subscribe((data) => {
            this.pictureSetData = JSON.parse(data);
            if (this.pictureSetData.error == false) {
                var alert_1 = this.showAlert(this.pictureSetData.error);
            }
            else {
                this.picSetList = this.pictureSetData.user_picture_set;
                for (var one = 0; one < this.picSetList.length; one++) {
                    //console.log(this.picSetList[one]);
                    var pictureList = this.picSetList[one].list_of_progress_pictures;
                    for(var two = 0; two < pictureList.length; two++){
                        var nextId = pictureList[two].progress_id;
                        this.progressSet[nextId] = pictureList[two].progress_message;
                        this.showPicture[nextId] = true;
                    }
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
/*
    updatePictureSetBefore  (picId) {
        
        this.fileUpload = this.base64Image;
        var subcribe = this.setService.updatePictureSetBefore(picId, this.fileUpload).subscribe((data) => {
            this.pictureSetData = JSON.parse(data);
            if (this.pictureSetData.status === false) {
                var alert_2 = this.showAlert(this.pictureSetData.error);
            }
            else {
                this.showToast("Progress Updated!");
                this.picSetList = this.pictureSetData.user_picture_set;
            }
        }, (error) => {
            console.log(error);
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => { 
            console.log("Finished! "); 
        });
    }
*/
    updateProgressSet  (picId) {
        var text_word = this.progressSet[picId];
        if(text_word.length > 0 && text_word.length < 250){
            var subcribe = this.setService.updateProgressSetService(picId, text_word).subscribe((data) => {
                this.pictureSetData = JSON.parse(data);
                if (this.pictureSetData.status === false) {
                    var alert_2 = this.showAlert(this.pictureSetData.error);
                }
                else {
                    this.showToast("Progress Updated!");
                    this.picSetList = this.pictureSetData.user_picture_set;
                }
            }, (error) => {
                console.log(error);
                var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
            }, () => { 
                console.log("Finished! "); 
            });
        }
        else{
            var alert = this.showAlert("Must be between 0 and 250 characters");
        }
    }

    deletePictureSet  (picSetId) {
        
        var subcribe = this.setService.deletePictureSet(picSetId).subscribe((data) => {
            this.pictureSetData = JSON.parse(data);
            if (this.pictureSetData.status === false) {
                var alert_5 = this.showAlert(this.pictureSetData.error);
            }
            else {
                this.showPicture[picSetId] = false;
                this.showToast("Picture Set deleted");
            }
        }, (error) => {
            console.log(error);
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => { 
            console.log("Finished! "); 
        });
    };

    showAlert  (mes) {
        var alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: mes,
            buttons: ['OK']
        });
        alert.present();
    };
    showToast  (mes) {
        this.platform.ready().then(() => {
            window.plugins.toast.show(mes, "short", "top");
        }).catch(()=>{
        });
    };
    // create a new post
    createPost = () => {
        this.nav.push(NewPostPage);
    };
  createPicture = () => {
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
      /*
    takeEditPicture  (picId) {
            this.loader = this.loadingCtrl.create({
                content: "processing picture...",
            });
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
                    this.loader.dismiss();
                    var alert_6 = this.showAlert(this.pictureSetData.error);
                }
                else {
                    this.loader.dismiss();
                    this.showToast("Picture Set Updated");
                }

            }, (error) => {
                console.log(error);
                this.loader.dismiss();
                var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
            }, () => { 
                console.log("Finished! "); 
            });
        }, function (err) {
            console.log(err);
            this.loader.dismiss();
        });
    };
    
        
    deletePictureSetBefore  (picId) {
        
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
        }, () => { 
            console.log("Finished! "); 
        });
    }

    deletePictureSetAfter  (picId) {
        
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
        }, () => { 
            console.log("Finished! "); 
        });
    };
      search  (ev) {
        var queryWord = ev.target.value;
        if (queryWord.length > 0) {
            this.nav.setRoot(SearchResultPage, { queryWord: queryWord });
            //console.log(this.queryWord, " query word");
        }
    }

    hideMilView  (picSetId) {
        for (var el = 0; el < this.picSetList.length; el++) {
            if (this.picSetList[el].id == picSetId) {
                this.picSetList[el].hidden == true;
                break;
            }
        }
    };
    updatePictureSetAfter  (picId) {
        this.takeEditPicture(picId);
    };
    */
}
