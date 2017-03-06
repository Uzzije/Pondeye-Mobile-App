import {Component} from '@angular/core';
import {NavController, ActionSheetController, NavParams, LoadingController, AlertController,  Platform} from 'ionic-angular';

import {PondService} from '../../services/pond-service';
import {PostService} from '../../services/post-service';
import {PostPage} from "../post/post";
import {UserPage} from "../user/user";
import {NewPostPage} from "../new-post/new-post";
import {Camera} from 'ionic-native';
import {NewPostServices} from '../../services/new-post-service';
import {SettingsService} from '../../services/settings-service';
import {NewPictureUploadPage} from '../pictureUpload/pictureUpload';
import {MilestonePage} from '../milestone-page/milestone-page';
import {UserService} from '../../services/user-service';
import {PondPage} from '../pond-page/pond-page';
import {SearchResultPage} from '../search-result-page/search-result-page';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
declare var window: any;
@Component({
  selector: 'ponds-page',
  templateUrl: 'ponds-page.html',
})
export class PondsPage {
    private queryWord = "";
    private loader: any;
    private base64Image;
    private milestones = [];
    private pondData;
    private ponds;
    private noPonds;
    // get sample data only
    private projID;
    constructor(private nav: NavController,  private userService: UserService,  private params: NavParams, private setService: SettingsService, private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public pondService: PondService, public alertCtrl: AlertController, public newPostService: NewPostServices) {
            // set sample data
            this.projID = this.params.get('id');
            this.loader = loadingCtrl.create({
            content: "Grabbing your ponds...",
            });
            this.loader.present();
   }

    ngOnInit(): void {
        
        var subcription = this.pondService.getListOfPonds().subscribe((data) => {
            this.pondData = JSON.parse(data);
            if (this.pondData.status == false) {
                var alert_1 = this.showAlert(this.pondData.error);
            }
            else {
                this.ponds = this.pondData.pond_list;
                this.noPonds = this.pondData.no_pond;
                //console.log("no pond ", this.noPonds);
            }
        }, (error) => { this.loader.dismiss(); var alert = this.showAlert(error); }, () => {
            console.log("Finished! ");
            this.loader.dismiss();
        });
    };

    viewPond  (pondId) {
        this.nav.push(PondPage, { id: pondId });
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
    showToast  (mes) {
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
            //console.log('base64Image pic ', this.base64Image);
            this.loader.dismiss();
            this.nav.push(NewPictureUploadPage, { 'fileName': this.base64Image });
        }, function (err) {
            console.log(err);
            this.loader.dismiss();
        });
        this.loader.dismiss();
    }
}
