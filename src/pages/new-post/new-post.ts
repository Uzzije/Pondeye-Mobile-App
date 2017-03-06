import {Component, OnInit} from '@angular/core';
import {NavController, ActionSheetController, NavParams, LoadingController, AlertController,  Platform} from 'ionic-angular';

import {PostService} from '../../services/post-service';
import {PostPage} from "../post/post";
import {UserPage} from "../user/user";
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

declare var window: any;
@Component({
  selector: 'page-new-post',
  templateUrl: 'new-post.html',
})

export class NewPostPage implements OnInit{
  private name_of_project = "";
  private public_status = "";
  private milestone_date = "";
  private queryWord = "";
  private name_of_mil_proj = ";";
  private length_of_time = "";
  private milestone_mil_date = "";
  private showMilstone = false;
  private showProject = false;
  private newPostData;
  private hasProj;
  private hasPond;
  private projAndPond;
  private tags = [];
  private base64Image;
  private loader: any;
  private projComTime;
  private projComDate;
  private milComTime;
  private milComDate;
  constructor(private nav: NavController,  private params: NavParams, private setService: SettingsService, 
              private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public alertCtrl: AlertController, public newPostService: NewPostServices) {}

    ngOnInit (): void {
        var subcription = this.newPostService.getNewPostData().subscribe((data) => {
            this.newPostData = JSON.parse(data);
            //console.log(this.newPostData);
            this.hasProj = this.newPostData.user_project.status;
            this.hasPond = this.newPostData.pond.status;
            this.projAndPond = this.newPostData;
        }, (error) => {
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => { 
            //console.log("Finished! " + this.newPostData); 
        });
    };

    openProjOption = () => {
        if (this.showProject) {
            this.showProject = false;
        }
        else {
            this.showProject = true;
            this.showMilstone = false;
        }
    }

    openMilOption = () => {
        if (this.showMilstone) {
            this.showMilstone = false;
        }
        else {
            this.showMilstone = true;
            this.showProject = false;
        }
    }

    addNewProject(name_of_project) {
        
        this.loader = this.loadingCtrl.create({
            content: "Adding Goal...",
        });
        this.loader.present();
        this.name_of_project = name_of_project;
        //console.log("name of project " + name_of_project);
        if (this.projComTime) {
            this.milestone_date = this.projComDate + 'T' + this.projComTime;
            //console.log("proj time " + this.projComTime + " mile date: " + this.milestone_date);
        }
        else {
            //console.log(" no proj time " + this.projComTime + " no mile date: " + this.milestone_date);
        }
        var subcribe = this.newPostService.postNewProject(this.name_of_project, this.public_status, this.milestone_date, this.tags).subscribe((data) => {
            this.newPostData = JSON.parse(data);
            if (this.newPostData.status === false) {
                var alert_1 = this.showAlert(this.newPostData.error);
            }
            else {
                this.nav.pop();
            }
        }, (error) => {
            this.loader.dismiss();
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => {
            console.log("Finished! ");
            this.loader.dismiss();
        });
    };
    
    addNewMilestone (milestone_name) {
        
        this.loader = this.loadingCtrl.create({
            content: "Adding Milestone...",
        });
        this.loader.present();
        if (this.milComTime && this.milComDate) {
            this.milestone_mil_date = this.milComDate + 'T' + this.milComTime;
        }
        else {
            //console.log(" no proj time " + this.projComTime + " no mile date: " + this.milestone_date);
        }
        var subcribe = this.newPostService.postNewMilestone(milestone_name, this.name_of_mil_proj, this.length_of_time, this.milestone_mil_date).subscribe((data) => {
            this.newPostData = JSON.parse(data);
            if (this.newPostData.status === false) {
                var alert_2 = this.showAlert(this.newPostData.error);
            }
            else {
                this.nav.push(ActivityPage);
            }
        }, (error) => {
            this.loader.dismiss();
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, () => {
            console.log("Finished! ");
            this.loader.dismiss();
        });
    }

    search(ev) {
        var queryWord = ev.target.value;
        if (queryWord.length > 0) {
            this.nav.setRoot(SearchResultPage, { queryWord: queryWord });
            //console.log(this.queryWord, " query word");
        }
    }

    showAlert(mes) {
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
        //console.log('base64Image pic ', this.base64Image);
            this.nav.push(NewPictureUploadPage, { 'fileName': this.base64Image });
        }, function (err) {
            console.log(err);
        });
    }

}
