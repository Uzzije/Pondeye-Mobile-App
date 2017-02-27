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
  selector: 'pond-edit-page',
  templateUrl: 'pond-edit.html',
})
export class PondEditPage {
    private pondNameArray = [];
    private pupModelArray = [];
    private tagModelArray = [];
    private pondMemberArray = [];
    private showPondArray = [];
    private queryWord = "";
    private loader: any;
    private base64Image;
    private pondEditData;
    private pondEditList;
    private hasPond;
    constructor(private nav: NavController,  private setService: SettingsService, private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public alertCtrl: AlertController, public newPostService: NewPostServices) {
            // set sample data
   
            this.loader = loadingCtrl.create({
            content: "Getting ponders fitness activities...",
            });
            this.loader.present();
   }

    ngOnInit(): void {
        
        var subcription = this.setService.getPondEditData().subscribe((data) => {
            this.pondEditData = JSON.parse(data);
            if (this.pondEditData.status === false) {
                var alert_1 = this.showAlert(this.pondEditData.error);
            }
            else {
                this.pondEditList = this.pondEditData.pond_list;
                this.hasPond = this.pondEditData.has_pond;
                for (var item = 0; item < this.pondEditList.length; item++) {
                    var nextId = this.pondEditList[item].id;
                    var pondName = this.pondEditList[item].name;
                    var pondPurpose = this.pondEditList[item].purpose;
                    this.pondNameArray[nextId] = pondName;
                    this.pupModelArray[nextId] = pondPurpose;
                    this.tagModelArray[nextId] = this.pondEditList[item].tag_list;
                    console.log("tags for pond", this.tagModelArray[nextId]);
                    this.showPondArray[nextId] = true;
                }
            }
        }, (error) => { this.loader.dismiss(); var alert = this.showAlert(error); }, () => {
            console.log("Finished! ");
            this.loader.dismiss();
        });
    };
    updateIndividualPondSet = function (nextId) {
        
        if (this.pondNameArray[nextId] && this.pupModelArray[nextId]) {
            var pondMember = this.pondMemberArray[nextId];
            var tagMember = this.tagModelArray[nextId];
            var subcribe = this.setService.updateIndividualPondSet(this.pondNameArray[nextId], this.pupModelArray[nextId], tagMember, pondMember, nextId).subscribe((data) => {
                this.pondEditData = JSON.parse(data);
                if (this.pondEditData.status === false) {
                    var alert_2 = this.showAlert(this.pondEditData.error);
                }
                else {
                    this.showToast("Pond Updated!");
                }
            }, (error) => { return alert(error); }, () => { return console.log("Finished! "); });
        }
    };
    deletePondSet = function (pondId) {
        
        var subcribe = this.setService.deletePondSet(pondId).subscribe((data) => {
            this.pondEditData = JSON.parse(data);
            if (this.pondEditData.status === false) {
                var alert_3 = this.showAlert(this.pondEditData.error);
            }
            else {
                this.showPondArray[pondId] = false;
                this.showToast("Pond Deleted!");
            }
        }, (error) => { return alert(error); }, () => { return console.log("Finished! "); });
    }

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
    takeEditPicture = function (picId) {
        
            Camera.getPicture({
            destinationType: Camera.DestinationType.DATA_URL,
            mediaType: Camera.MediaType.PICTURE,
            encodingType: Camera.EncodingType.JPEG,
            correctOrientation: true
        }).then(function (imageData) {
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