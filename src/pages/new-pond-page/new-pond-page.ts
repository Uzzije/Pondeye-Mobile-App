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
import {MilestonePage} from '../milestone-page/milestone-page';
import {PondService} from '../../services/pond-service';
import {ActivityPage} from '../activity/activity';
import {UserService} from '../../services/user-service';
import {ProjectPage} from '../project-page/project-page';
import {SearchResultPage} from '../search-result-page/search-result-page';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
declare var window: any;
@Component({
  selector: 'new-pond-page',
  templateUrl: 'new-pond-page.html',
})
export class NewPondPage {
    private queryWord = "";
    private loader: any;
    private base64Image;
    private milestones = [];
    // get sample data only
    private pondId;
    constructor(private nav: NavController,  private userService: UserService,  private newPondService: PondService, private params: NavParams, private setService: SettingsService, 
                private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public alertCtrl: AlertController, public newPostService: NewPostServices) {
                
   }

   createPondEntry = function (name_of_pond, purpose) {
        if (name_of_pond && purpose) {
            this.loader = this.loadingCtrl.create({
                content: "Creating new pond...",
            });
            this.loader.present();
            var subscribe = this.newPondService.newPondEntry(name_of_pond, purpose, this.tags);
            subscribe.subscribe((data) => {
                this.pondData = JSON.parse(data);
                if (this.pondData.status === false) {
                    var alert_1 = this.showAlert(this.pondData.error);
                }
                else {
                    this.nav.setRoot(ActivityPage);
                }
            }, (error) => { this.loader.dismiss(); var alert = this.showAlert(error); }, () => {
                console.log("Finished! ");
                this.loader.dismiss();
            });
        }
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
        this.platform.ready().then(() => {
            window.plugins.toast.show(mes, "short", "top");
        });
    };
 
    // create a new post
    createPost = () => {
        this.nav.push(NewPostPage);
    };
    createPicture = () => {
        this.takePicture();
    };
    takePicture = () => {
        
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
