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
    private tags = [];
    private pondData;
    constructor(private nav: NavController,  private userService: UserService,  private newPondService: PondService, private params: NavParams, private setService: SettingsService, 
                private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public alertCtrl: AlertController, public newPostService: NewPostServices) {
                
   }

   createPondEntry  (name_of_pond, purpose) {
        if (name_of_pond && purpose) {
            //console.log('tags of pond ', this.tags);
            this.loader = this.loadingCtrl.create({
                content: "Creating new pond...",
            }); 
            this.loader.present();
            if(this.tags.length > 0){
                var subscribe = this.newPondService.newPondEntry(name_of_pond, purpose, this.tags);
            }else{
                var subscribe = this.newPondService.newPondEntry(name_of_pond, purpose, []);
            }
            

            subscribe.subscribe((data) => {
                this.pondData = JSON.parse(data);
                if (this.pondData.status === false) {
                    var alert_1 = this.showAlert(this.pondData.error);
                }
                else {
                    this.nav.setRoot(ActivityPage);
                }
            }, (error) => { 
                    this.loader.dismiss(); var alert = this.showAlert(error); 
                }, () => {
                console.log("Finished! ");
                this.loader.dismiss();
            });
        }
    };

    search  (ev) {
        var queryWord = ev.target.value;
        if (queryWord.length > 0) {
            this.nav.setRoot(SearchResultPage, { queryWord: queryWord });
            //console.log(this.queryWord, " query word");
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
    showToast (mes) {
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
