import {Component} from '@angular/core';
import {NavController, ActionSheetController, NavParams, LoadingController, AlertController,  Platform} from 'ionic-angular';

import {PostService} from '../../services/post-service';
import {PostPage} from "../post/post";
import {UserPage} from "../user/user";
import {NewPostPage} from "../new-post/new-post";
import {Camera} from '@ionic-native/camera';
import {NewPostServices} from '../../services/new-post-service';
import {SettingsService} from '../../services/settings-service';
import {NewPictureUploadPage} from '../pictureUpload/pictureUpload';
import {ActivityPage} from '../activity/activity';
import {SearchResultPage} from '../search-result-page/search-result-page';
import {TermsAndConditionPage} from '../terms-and-condition/terms-and-condition';
declare var window: any;
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  private newUser;
  private queryWord = "";
  private base64Image;
  private loader: any;
  constructor(private nav: NavController,  private params: NavParams, private setService: SettingsService, private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public alertCtrl: AlertController, public newPostService: NewPostServices) {
                this.newUser = this.params.get('newUser');

  }

  goToFeed  () {
        this.nav.setRoot(ActivityPage);
    };

  search  (ev) {
        var queryWord = ev.target.value;
        if (queryWord.length > 0) {
            this.nav.setRoot(SearchResultPage, { queryWord: queryWord });
            console.log(this.queryWord, " query word");
        }
    }

    showAlert  (mes) {
        var alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: mes,
            buttons: ['OK']
        });
        alert.present();
    };
    showToast  (mes) {
        this.platform.ready().then(function () {
            window.plugins.toast.show(mes, "short", "top");
        }).catch(function(err){
            console.log(err)
        });
    };
    goToTerms(){
        this.nav.push(TermsAndConditionPage)
    }
    // create a new post
    createPost  () {
        this.nav.setRoot(NewPostPage);
    };
    createPicture  () {
       // this.takePicture();
    };
     takePicture (){ 
         /*
         this.loader = this.loadingCtrl.create({
            content: "processing picture...",
            });
          this.loader.present();
          Camera.getPicture({
            destinationType:  Camera.DestinationType.DATA_URL,
            mediaType: Camera.MediaType.PICTURE,
            encodingType: Camera.EncodingType.JPEG,
            correctOrientation: true
        }).then((imageData) => {
            this.base64Image = "data:image/jpeg;base64," + imageData;
            console.log('base64Image pic ', this.base64Image);
            this.loader.dismiss();
            this.nav.push(NewPictureUploadPage, { 'fileName': this.base64Image });
        }, function (err) {
            console.log(err);
            this.loader.dismiss();
        });
        this.loader.dismiss();
    }
    */
     }
}
