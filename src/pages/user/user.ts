import {Component,  NgZone} from '@angular/core';
import {NavController, ActionSheetController, NavParams, LoadingController, AlertController,  Platform} from 'ionic-angular';

import {PostService} from '../../services/post-service';
import {PostPage} from "../post/post";

import {NewPostPage} from "../new-post/new-post";
import {SettingsPage} from '../settings/settings';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {NewPostServices} from '../../services/new-post-service';
import {SettingsService} from '../../services/settings-service';
import {NewPictureUploadPage} from '../pictureUpload/pictureUpload';
import {MilestonePage} from '../milestone-page/milestone-page';
import {NotificationService} from '../../services/notification-service';
import {ProjectPage} from '../project-page/project-page';
import {SearchResultPage} from '../search-result-page/search-result-page';
import {PondService} from '../../services/pond-service';
import {UserService} from '../../services/user-service';
import {PictureUploadService} from '../../services/pictureUploadService';
import { FriendsPage } from '../friends/friends';
import {ProjectsPage} from '../projects/projects';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions} from '@ionic-native/media-capture';
import { File } from '@ionic-native/file';
import { PhotoViewer } from '@ionic-native/photo-viewer';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
declare var window: any;
@Component({
  selector: 'page-user',
  templateUrl: 'user_c.html',
  providers: [Camera, File, MediaCapture, PhotoViewer],
})
export class UserPage {
  public user: any;
  private queryWord = "";
  private loader: any;
  private base64Image;
  private userId;
  private userData;
  private userDetails;
  private profilePic;
  private profilePicStorage;
  private aval_pond;
  private currentMilestone;
  private currentProjects;
  private completedMilCount;
  private completedProjCount;
  private failedMilCount;
  private failedProjCount;
  private firstName;
  private lastName;
  private statusOfUser;
  private profUserId;
  private yourProfile;
  private userName = localStorage.getItem('username');
  private user_stor_id = localStorage.getItem('userId');
  private selectedPond;
  private allProjects;
  private showStats;
  private hasProj = false;
  private gradeHigh = false;
  private cover_url = 'assets/img/cover.jpg';
  private background_url = 'assets/img/user/blur-stats-view.jpg';
  private user_stats: any;
  private challenges_count;
  private challenges_completed;
  private friend_count;
  private ownProfile = false;
  private followerCount;
  private isFriend: any;
  private videoData;
  private vidDir;
  private vidStorage; 
  private hasRecentProj;
  private friendStatus = 'Add Friend';
  private grade;
  constructor(private nav: NavController, private userService: UserService, private pondService: PondService, 
              private picUploadService: PictureUploadService, private navParams: NavParams, private setService: SettingsService, private postService: PostService, 
              public actionSheetCtrl: ActionSheetController, private camera: Camera,
              public platform: Platform, public loadingCtrl: 
              LoadingController, private zone: NgZone, private photoViewer: PhotoViewer,
              private fileReader: File, private mediaCapture: MediaCapture, 
              public alertCtrl: AlertController, public newPostService: NewPostServices) {
    // get sample data only
   this.userId = this.navParams.get('id');
   
   this.loader = this.loadingCtrl.create({
            content: "Grabbing profile...",
    });
    this.loader.present();
    
    if(!this.userId){
        this.switchTabs();
    }
  }

    ngOnInit(): void {
        if(!this.userId || (this.userId == this.user_stor_id)){
            this.ownProfile = true; 
            
        }
        this.loadUserDetails();
    };
    /*
    ionViewWillEnter(){
        this.loadUserDetails();
    }
    */
    loadUserDetails(){
        var subcription = this.userService.getUserInformation(this.userId, this.ownProfile).subscribe((data) => {
            this.zone.run(() => {
                this.userData = JSON.parse(data);
            })
            if (this.userData.status == false) {
                var alert_1 = this.showAlert(this.userData.error);
            }
            else {
                this.userDetails = this.userData.user_details;
                this.profilePic = this.userDetails.profile_url;
                this.profilePicStorage = this.userDetails.profile_url_storage;
                this.aval_pond = this.userDetails.aval_pond;
                this.currentMilestone = this.userDetails.current_tasks;
                this.currentProjects = this.userDetails.current_projs;
                this.hasRecentProj = this.userDetails.current_projs.length > 0;
                this.challenges_count = this.userDetails.challenges_count;
                this.challenges_completed = this.userDetails.challenges_count;
                this.friend_count = this.userDetails.friend_count;
                this.firstName = this.userDetails.first_name;
                this.lastName = this.userDetails.last_name;
                this.statusOfUser = this.userDetails.status_of_user;
                this.profUserId = this.userDetails.user_id;
                this.ownProfile = this.userDetails.is_own_profile;
                this.user_stats = this.userDetails.user_stats;
                this.allProjects = this.userDetails.all_projects;
                this.userName = this.userDetails.user_name;
                this.followerCount = this.userDetails.follower_count
                this.userId = this.userDetails.user_id;
                this.isFriend = this.userDetails.is_friend;
                this.grade = this.userDetails.grade;
                if(this.user_stats.consistency_percentage > 75){
                    this.gradeHigh = true;
                }
                if(this.allProjects.length > 0){
                    this.hasProj = true;
                }
                //console.log(this.userDetails);
                //console.log("profile pic, ", this.profilePicStorage);
                if (this.yourProfile) {
                    localStorage.setItem("profile_url", this.profilePicStorage);
                }
                else {
                    this.userName = this.userDetails.user_name;
                }
                console.log(this.hasRecentProj);
                //console.log(localStorage.getItem("profile_url"));
            }
        }, (error) => { 
            this.loader.dismiss(); var alert = this.showAlert(error); 
        }, () => {
            //console.log("Finished! ");
            this.loader.dismiss();
        });
    }
    doRefresh(refresher) {
        console.log('Begin async operation', refresher);
        this.loadUserDetails();
        setTimeout(() => {
        console.log('Async operation has ended');
        refresher.complete();
        }, 3000);
    }

    switchTabs() {
        this.nav.parent.select(3);
    }

    viewProject (id) {
        console.log("project view");
        this.nav.push(ProjectPage, { id: id });
        
    }

    viewFriendProjects(){
        console.log("project view");
        //this.nav.push(ProjectPage, { friends:  });
    }
    changProfilePicture (user_id) {
      
        if (this.base64Image) {
            this.loader = this.loadingCtrl.create({
            content: "changing picture...",
        });
        this.loader.present();
            var subscribe = this.picUploadService.profilePictureUpload(this.base64Image, user_id);
            subscribe.subscribe((data) => {
                var statusData = JSON.parse(data);
                if (statusData.status === false) {
                    this.loader.dismiss();
                    var alert_2 = this.showAlert(statusData.error);
                }
                else {
                    this.loader.dismiss();
                    this.profilePic = statusData.url;
                    this.showToast("Information Updated!");
                    //console.log(this.profilePic);
                }
            }, (error) => { 
                this.loader.dismiss();
                alert(error); 
            }, 
            () => { 
                this.loader.dismiss();
                //console.log("Finished! "); 
            });
        }
    };
    goToSettings(){
        this.nav.push(SettingsPage);
    }
    takeProfilePicture(user_id) {
        const options: CameraOptions = {
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth: 400,
            targetHeight: 400,
            mediaType:this.camera.MediaType.PICTURE,
            encodingType:this.camera.EncodingType.JPEG
        }
        this.camera.getPicture(options).then((imageData) => {
            this.base64Image = "data:image/jpeg;base64," + imageData;
            this.changProfilePicture(user_id);
            
        }, function (err) {
            //console.log(err);
        });

    };

    markProjectDone (projId) {
        var subscribe = this.userService.markProjectDone(projId);
        subscribe.subscribe((data) => {
            var statusData = JSON.parse(data);
            if (statusData.status === false) {
                var alert_3 = this.showAlert(statusData.error);
            }
            else {
                this.showToast("Completion Noted!");
            }
        }, (error) => { 
            alert(error); 
        }, () => { 
            console.log("Finished! "); 
        });
      };

    verifyProjDone(projId){
        let alert = this.alertCtrl.create({
            title: 'Confirm Completed Goal',
            message: 'Are you sure you want to mark this goal as completed?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        this.showToast("Can't wait till it's done!");
                    }
                },
                {
                    text: "Yep!",
                    handler: () => {
                        this.markProjectDone (projId)
                    }
                }
            ]
        });
        alert.present();
    }

    markMilestoneDone (milId) {
        
        //console.log("lay it down for gospel ");
        var subscribe = this.userService.markMilestoneDone(milId);
        subscribe.subscribe((data) => {
            var statusData = JSON.parse(data);
            if (statusData.status === false) {
                var alert_4 = this.showAlert(statusData.error);
            }
            else {
                this.showToast("Completion Noted!");
            }

        });
    }
    viewProfilePicture(){
        this.photoViewer.show(this.profilePic);
    }
    addUsertoPond () {
        var subscribe = this.pondService.addUserToPond(this.selectedPond, this.profUserId);
        subscribe.subscribe( (data) => {
            var statusData = JSON.parse(data);
            if (statusData.status === false) {
                var alert_5 = this.showAlert(statusData.error);
            }
            else {
                this.aval_pond = statusData.aval_pond;
                this.showToast("Added to Pond!");
            }
        }, (error) => { 
            alert(error); }, 
            () => 
                { 
                console.log("Finished! "); 
        });
    }
    addUserToFriends () {
        var subscribe = this.pondService.addUserToFriends(this.profUserId);
        subscribe.subscribe( (data) => {
            var statusData = JSON.parse(data);
            if (statusData.status === false) {
                var alert_5 = this.showAlert(statusData.error);
            }
            else {
                this.aval_pond = statusData.aval_pond;
                this.showToast("Sent Friend Request!");
            }
        }, (error) => { 
            alert(error); }, 
            () => 
                { 
                console.log("Finished! "); 
        });
        this.friendStatus = 'Request Sent!';
    }

   search (ev) {
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
    }

    showToast  (mes) {
        this.platform.ready().then(() => {
            window.plugins.toast.show(mes, "short", "top");
        }).catch(()=>{
        });
    }

    createPost = () => {
        this.nav.push(NewPostPage);
    };
    createPicture = () => {
        this.takePicture();
    };

    viewFriends(userId){
        this.nav.push(FriendsPage, { id: userId });
    }

    viewAllProjects(){
        this.nav.push(ProjectsPage, { id: this.userId, public:false });
    }
    viewPublicProjects(){
        console.log("project view");
        this.nav.push(ProjectsPage, { id: this.userId, public:true });
    }
    takePicture (){ 
      const options: CameraOptions = {
          quality: 100,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE
       }
          this.camera.getPicture(options).then((imageData) => {
            this.base64Image = "data:image/jpeg;base64," + imageData;
            //console.log('base64Image pic ', this.base64Image);
            this.nav.push(NewPictureUploadPage, { 'fileName': this.base64Image });
        }).catch((err)=>{
            console.log(err);
        });
    }

    toggleStatShow (){
        this.showStats = !this.showStats;
    }

    record(){
        
        let videoOptions = {
            number: 1,
            duration: 10,
            height:1080,
            width:1080
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
            var vidpromise = this.fileReader.readAsDataURL(this.vidDir, this.vidStorage[0].name);
            console.log(vidpromise);
            vidpromise.then((data)=>{
                /*
                console.log(this.vidDir);
                console.log(this.vidStorage[0].name);
                console.log(data);
                */
                let base64Video = data;
                //this.fileReader.removeFile(this.vidDir, this.vidStorage[0].name);
                console.log("reaching here");
                this.nav.push(NewPictureUploadPage, { 'fileName': base64Video, 'isVideo':true });
                }, error=>{
                    console.log(error);
                }).catch(function(err: CaptureError){
                    console.log(err);
                    console.log("error in capturing information");
                })
        }, error=>{
            console.log(error);
        }
        ).catch(function(err: CaptureError){
            console.log(err);
            console.log("error in capturing information");
        })
        /*
        let videoFile = File.createFromFileName(this.videoData);
        let reader = new FileReader();
        reader.readAsBinaryString(videoFile);
        blah
        console.log('base64Video ', base64Video);
        */
    }

}
