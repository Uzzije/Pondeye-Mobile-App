import {Component, OnInit} from '@angular/core';
import {NavController, ActionSheetController, NavParams, LoadingController, AlertController,  Platform} from 'ionic-angular';

import {PostService} from '../../services/post-service';
import {PostPage} from "../post/post";
import {UserPage} from "../user/user";
import {Camera} from '@ionic-native/camera';
import {NewPostServices} from '../../services/new-post-service';
import {SettingsService} from '../../services/settings-service';
import {NewPictureUploadPage} from '../pictureUpload/pictureUpload';
import {MilestonePage} from '../milestone-page/milestone-page';
import {PondService} from '../../services/pond-service';
import {ActivityPage} from '../activity/activity';
import {UserService} from '../../services/user-service';
import {ProjectPage} from '../project-page/project-page';
import {SearchResultPage} from '../search-result-page/search-result-page';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions} from '@ionic-native/media-capture';
import { File } from '@ionic-native/file';


declare var window: any;
@Component({
  selector: 'page-new-post',
  templateUrl: 'new-post.html',
  providers:[File, MediaCapture]
})

export class NewPostPage implements OnInit{
  private name_of_project = "";
  private public_status = "";
  private challenged_user = "";
  private challengable_users: any;
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
  private videoData = "";
  private vidStorage;
  private vidDir;
  private introVideoData;
  constructor(private nav: NavController,  private params: NavParams, private setService: SettingsService, 
              private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public mediaCapture: MediaCapture, private fileReader: File,
              public alertCtrl: AlertController, public newPostService: NewPostServices) {}

    ngOnInit (): void {
        var subcription = this.newPostService.getNewPostData().subscribe((data) => {
            this.newPostData = JSON.parse(data);
            //console.log(this.newPostData);
            this.hasProj = this.newPostData.user_project.status;
            this.hasPond = this.newPostData.pond.status;
            this.projAndPond = this.newPostData;
            this.challengable_users = this.newPostData.challengable_users;
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

    addNewChallenge(name_of_project) {
        
        this.loader = this.loadingCtrl.create({
            content: "Adding Challenge...",
        });
        this.loader.present();
        this.name_of_project = name_of_project;
        //console.log("name of project " + name_of_project);
        var subcribe = this.newPostService.postNewChallenge(this.name_of_project, this.challenged_user, 
            this.projComDate, this.tags, this.introVideoData).subscribe((data) => {
            this.newPostData = JSON.parse(data);
            if (this.newPostData.status === false) {
                var alert_1 = this.showAlert(this.newPostData.error);
            }
            else {
                this.showToast  ("New Challenge Added!");
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
        }).catch(()=>{
        });
    };
 
    // create a new post
    createPost = () => {
        this.nav.push(NewPostPage);
    };
    createProjectPicture = () => {
       // this.addProjectPic();
    };

    record(){
        
        let videoOptions = {
            number: 1,
            duration: 10,
        }
        let options: CaptureImageOptions = { limit: 3 };
        var captureVid = this.mediaCapture.captureVideo(videoOptions);
        captureVid.then((vidData: MediaFile[])=>{
            var type_of_obj = typeof captureVid;
            this.vidStorage = vidData;
            if(this.platform.is('ios')){
                var name = "/"+this.vidStorage[0].name
                this.vidDir = "file://"+this.vidStorage[0]['fullPath'].replace(name, "");
            }else{
                this.vidDir = this.vidStorage[0]['fullPath'].replace(this.vidStorage[0].name, "")
            }   
            console.log(this.vidDir);
            let videoPromise = this.fileReader.readAsDataURL(this.vidDir, this.vidStorage[0].name);
            return videoPromise;
        }).then((data)=>{
            console.log(this.vidDir);
            console.log(this.vidStorage[0].name);
            console.log(data);
            let base64Video = data;
            //this.fileReader.removeFile(this.vidDir, this.vidStorage[0].name);
            console.log("reaching here");
            this.introVideoData = { 'fileName': base64Video, 'isVideo':true };
            }, error=>{
                console.log(error);
        }).catch(function(err: CaptureError){
            console.log(err);
            console.log("error in capturing information");
        })
        /*
        }, error=>{
            console.log(error);
        }
        ).catch(function(err: CaptureError){
            console.log(err);
            console.log("error in capturing information");
        })
    
        let videoFile = File.createFromFileName(this.videoData);
        let reader = new FileReader();
        reader.readAsBinaryString(videoFile);
        blah
        console.log('base64Video ', base64Video);
        */
    }

    addProjectPic (){ 
        /*
        Camera.getPicture({
        destinationType:  Camera.DestinationType.DATA_URL,
        mediaType: Camera.MediaType.PICTURE,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: true
        }).then((imageData) => {
           this.base64Image = "data:image/jpeg;base64," + imageData;
           //console.log('base64Image pic ', this.base64Image);
           //this.uploadProjectPicture();
        }, function (err) {
            console.log(err);
        });
        */
    }
}

