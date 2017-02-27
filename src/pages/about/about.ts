import {Component} from '@angular/core';
import {NavController, ActionSheetController, NavParams, LoadingController, AlertController,  Platform} from 'ionic-angular';

import {PostService} from '../../services/post-service';
import {PostPage} from "../post/post";
import {UserPage} from "../user/user";
import {NewPostPage} from "../new-post/new-post";
import {Camera} from 'ionic-native';
import {NewPostServices} from '../../services/new-post-service';
import {SettingsService} from '../../services/settings-service';
import {NewPictureUploadPage} from '../pictureUpload/pictureUpload';
import {ActivityPage} from '../activity/activity';
import {SearchResultPage} from '../search-result-page/search-result-page';

declare var window: any;
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  private newUser;
  private queryWord = "";
  constructor(private nav: NavController,  private params: NavParams, private setService: SettingsService, private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public alertCtrl: AlertController, public newPostService: NewPostServices) {
                this.newUser = this.params.get('newUser');

  }

  goToFeed = function () {
        this.nav.setRoot(ActivityPage);
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
 
    // create a new post
    createPost = function () {
        this.nav.setRoot(NewPostPage);
    };
    createPicture = function () {
        this.takePicture();
    };
    takePicture = function () {
        
        Camera .getPicture({
            destinationType: Camera .DestinationType.DATA_URL,
            mediaType: Camera .MediaType.PICTURE,
            encodingType: Camera .EncodingType.JPEG,
            correctOrientation: true
        }).then(function (imageData) {
            this.base64Image = "data:image/jpeg;base64," + imageData;
            this.nav.setRoot(NewPictureUploadPage, { 'fileName': this.base64Image });
        }, function (err) {
            console.log(err);
        });
    };

}
