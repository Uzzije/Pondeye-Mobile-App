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
import {MilestoneEditPage} from './milestone-edit';
import {ProjectEditPage} from './project-edit';
import {PersonalInfoEditPage} from './personal-info-edit';
import {PondEditPage} from './pond-edit';
import {PictureEditPage} from './picture-edit';
import {SearchResultPage} from '../search-result-page/search-result-page';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
declare var window: any;
@Component({
  selector: 'settings-edit-page',
  templateUrl: 'settings.html',
})
export class SettingsPage {

    private queryWord = "";
    private base64Image;
    constructor(private nav: NavController,  private setService: SettingsService, private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public alertCtrl: AlertController, public newPostService: NewPostServices) {
   }

   navToMilEdit = function () {
        this.nav.push(MilestoneEditPage);
    };
   navToPersonalInfoEdit = function () {
        this.nav.push(PersonalInfoEditPage);
    };
   navToPondEdit = function () {
        this.nav.push(PondEditPage);
    };
   navToProjEdit = function () {
        this.nav.push(ProjectEditPage);
    };
   navToPictureSetEdit = function () {
        this.nav.push(PictureEditPage);
    };

    search = function (ev) {
        var queryWord = ev.target.value;
        if (queryWord.length > 0) {
            this.nav.setRoot(SearchResultPage, { queryWord: queryWord });
            console.log(this.queryWord, " query word");
        }
    }

    showAlert = function (mes) {
        var alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: mes,
            buttons: ['OK']
        });
        alert.present();
    };
    showToast = function (mes) {
        this.platform.ready().then(function () {
            window.plugins.toast.show(mes, "short", "top");
        });
    };

    createPost = function () {
        this.nav.setRoot(NewPostPage);
    };
    createPicture = function () {
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