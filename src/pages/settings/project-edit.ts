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
  selector: 'project-edit-page',
  templateUrl: 'project-edit.html',
})
export class ProjectEditPage {
    private tagModelArray = [];
    private queryWord = "";
    private loader: any;
    private base64Image;
    private projEditData;
    private projectList;
    private hasProject;
    private modelArray = [];
    private showProjectArray = [];
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
        
        this.loader.present();
        var subcription = this.setService.getProjectEditData().subscribe((data) => {
            this.projEditData = JSON.parse(data);
            console.log(this.projEditData);
            if (this.projEditData.status == false) {
                var alert_1 = this.showAlert(this.projEditData.error);
            }
            this.projectList = this.projEditData.project_list;
            console.log("project list ", this.projectList);
            if (this.projectList.length > 0) {
                this.hasProject = true;
                for (var item = 0; item < this.projectList.length; item++) {
                    var nextId = this.projectList[item].id;
                    var projValue = this.projectList[item].proj_name;
                    console.log("project value ", projValue);
                    this.modelArray[nextId] = projValue;
                    this.tagModelArray[nextId] = this.projectList[item].tag_list;
                    this.showProjectArray[nextId] = true;
                }
            }
        }, (error) => { this.loader.dismiss(); var alert = this.showAlert(error); }, () => {
            console.log("Finished! " + this.projEditData);
            this.loader.dismiss();
        });
    };
    updateProject  (projId) {
        
        console.log("tags printed out ", this.tagModelArray[projId]);
        var subcribe = this.setService.updateProject(projId, this.modelArray[projId], this.tagModelArray[projId]).subscribe((data) => {
            this.projEditData = JSON.parse(data);
            if (this.projEditData.status === false) {
                var alert_2 = this.showAlert(this.projEditData.error);
            }
            else {
                this.showToast("Updated Project!");
            }
        }, (error) => { return alert(error); }, () => { return console.log("Finished!"); });
    };
    deleteProject  (projId) {
        
        var subcribe = this.setService.deleteProject(projId).subscribe((data) => {
            this.projEditData = JSON.parse(data);
            if (this.projEditData.status === false) {
                var alert_3 = this.showAlert(this.projEditData.error);
            }
            else {
                this.showProjectArray[projId] = false;
                this.showToast("Project Deleted");
            }
        }, (error) => { return alert(error); }, () => { return console.log("Finished!"); });
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
            console.log('base64Image pic ', this.base64Image);
            this.nav.push(NewPictureUploadPage, { 'fileName': this.base64Image });
        }, function (err) {
            console.log(err);
        });
    }
    
}