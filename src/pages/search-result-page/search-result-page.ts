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
import {UserService} from '../../services/user-service';
import {PondPage} from '../pond-page/pond-page';
import {ProjectPage} from '../project-page/project-page';
import {SearchService} from '../../services/search-service';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
declare var window: any;
@Component({
  selector: 'project-page',
  templateUrl: 'search-result-page.html',
})
export class SearchResultPage {
    private queryWord = "";
    private loader: any;
    private base64Image;
    private milestones = [];
    private noResult = false;
    // get sample data only
    private projID;
    private resultData;
    private dataResult;
    constructor(private nav: NavController,  private userService: UserService,  private params: NavParams, 
                private setService: SettingsService, private postService: PostService, public actionSheetCtrl: ActionSheetController,
                public platform: Platform, public loadingCtrl: 
                LoadingController, public searchService: SearchService,
                public alertCtrl: AlertController, public newPostService: NewPostServices) {
            // set sample data
            this.queryWord = this.params.get('queryWord');
            this.loader = loadingCtrl.create({
            content: "Grabbing your request...",
            });
            this.loader.present();
   }

    ngOnInit(): void {
        
        var subcription = this.searchService.getsearchResult(this.queryWord).subscribe((data) => {
            console.log("search word ", this.queryWord);
            this.resultData = JSON.parse(data);
            if (this.resultData.status == false) {
                var alert_1 = this.showAlert(this.resultData.error);
            }
            else {
                this.dataResult = this.resultData.result_list;
                if (this.dataResult.length == 0) {
                    this.noResult = true;
                }
            }
        }, (error) => {
            console.log(error);
            this.loader.dismiss();
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => {
            console.log("Finished! ");
            this.loader.dismiss();
        });
    };

     // view pond
    viewPond = function (pondId) {
        this.nav.push(PondPage, { id: pondId });
    };
    viewMilestone = function (id) {
        this.nav.push(MilestonePage, { id: id });
    };
    viewProject = function (id) {
        this.nav.push(ProjectPage, { id: id });
    };
    viewProfile = function (id) {
        this.nav.push(UserPage, { id: id });
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
