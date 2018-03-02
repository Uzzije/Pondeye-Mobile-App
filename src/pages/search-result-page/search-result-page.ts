import {Component} from '@angular/core';
import {IonicPage, NavController, ActionSheetController, NavParams, LoadingController, AlertController,  Platform} from 'ionic-angular';

import {PostService} from '../../services/post-service';
import {PostPage} from "../post/post";
import {UserPage} from "../user/user";
import {NewPostPage} from "../new-post/new-post";
import {Camera} from '@ionic-native/camera';
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

@IonicPage()
@Component({
  selector: 'search-page',
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
    private tagSearch = "";
    private firstIndex;
    private endIndex;
    constructor(private nav: NavController,  private userService: UserService,  private params: NavParams, 
                private setService: SettingsService, private postService: PostService, public actionSheetCtrl: ActionSheetController,
                public platform: Platform, public loadingCtrl: 
                LoadingController, public searchService: SearchService,
                public alertCtrl: AlertController, public newPostService: NewPostServices) {
            // set sample data
            this.queryWord = this.params.get('queryWord');
            this.tagSearch = this.params.get('tagSearch');
            this.loader = loadingCtrl.create({
                content: "Grabbing your request...",
            });
            this.loader.present();
             
            if(this.tagSearch){
                this.queryWord = this.tagSearch;
            }else{
                this.switchTabs();
            }
   }

    ngOnInit(): void {
        
        if(this.queryWord && !this.tagSearch){
            var subcription = this.searchService.getsearchResult(this.queryWord).subscribe((data) => {
                //console.log("search word ", this.queryWord);
                this.resultData = JSON.parse(data);
                if (this.resultData.status == false) {
                    var alert_1 = this.showAlert(this.resultData.error);
                }
                else {
                    this.dataResult = this.resultData.result_list;
                    console.log(this.dataResult);
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
        }else if(this.tagSearch){
            this.queryWord = this.tagSearch; 
            this.findProjectByTags(); 
            this.loader.dismiss(); 
        }else{
            this.firstIndex = 0;
            this.endIndex = 6;
            localStorage.setItem('disFIndex', this.firstIndex.toString());
            localStorage.setItem('disEIndex', this.endIndex.toString());
            this.discoverProjects();
            this.loader.dismiss();
        }
    };
    discoverProjects(){
        this.firstIndex = localStorage.getItem('disFIndex');
        this.endIndex   = localStorage.getItem('disEIndex');
        if (this.queryWord.length > 0) {
            var subcription = this.searchService.discover(this.firstIndex, this.endIndex).subscribe((data) => {
              //console.log("search word ", this.queryWord);
              this.resultData = JSON.parse(data);
              if (this.resultData.status == false) {
                  var alert_1 = this.showAlert(this.resultData.error);
              }
              else {
                  this.dataResult = this.resultData.result_list;
                  console.log(this.dataResult);
                  if (this.dataResult.length == 0) {
                      this.noResult = true;
                  }else{
                    this.firstIndex = this.endIndex;
                    this.endIndex = parseInt(this.endIndex) + 6;
                    localStorage.setItem('disFIndex', this.firstIndex.toString());
                    localStorage.setItem('disEIndex', this.endIndex.toString());
                  }
              }
          }, (error) => {
              console.log(error);
              var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
          }, () => {
              console.log("Finished! ");
              
          });
        }
    }
    loadMoreDiscoverProjects(){
        this.firstIndex = localStorage.getItem('disFIndex');
        this.endIndex   = localStorage.getItem('disEIndex');
        if (this.queryWord.length > 0) {
            var subcription = this.searchService.discover(this.firstIndex, this.endIndex).subscribe((data) => {
              //console.log("search word ", this.queryWord);
              this.resultData = JSON.parse(data);
              if (this.resultData.status == false) {
                  var alert_1 = this.showAlert(this.resultData.error);
              }
              else {
                  this.dataResult = this.resultData.result_list;
                  for (var item = 0; item < this.dataResult.all_feeds.length; item++){
                    this.dataResult.push(this.resultData.result_list[item]);
                  }
                  console.log(this.dataResult);
                  if (this.dataResult.length == 0) {
                      this.noResult = true;
                  }else{
                    this.firstIndex = this.endIndex;
                    this.endIndex = parseInt(this.endIndex) + 6;
                    localStorage.setItem('disFIndex', this.firstIndex.toString());
                    localStorage.setItem('disEIndex', this.endIndex.toString());
                  }
              }
          }, (error) => {
              console.log(error);
              var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
          }, () => {
              console.log("Finished! ");
              
          });
        }
    }
    findProjectByTags () {
        
        if (this.queryWord.length > 0) {
            var subcription = this.searchService.getTagResult(this.queryWord).subscribe((data) => {
              //console.log("search word ", this.queryWord);
              this.resultData = JSON.parse(data);
              if (this.resultData.status == false) {
                  var alert_1 = this.showAlert(this.resultData.error);
              }
              else {
                  this.dataResult = this.resultData.result_list;
                  console.log(this.dataResult);
                  if (this.dataResult.length == 0) {
                      this.noResult = true;
                  }
              }
          }, (error) => {
              console.log(error);
              var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
          }, () => {
              console.log("Finished! ");
              
          });
        }
    }

    /*
    findTagView(queryWord){
        this.nav.setRoot(SearchResultPage, {tagSearch:queryWord});
    }
    */
     // view pond
    viewPond  (pondId) {
        this.nav.push(PondPage, { id: pondId });
    };
    viewMilestone  (id) {
        this.nav.push(MilestonePage, { id: id });
    };
    viewProject  (id) {
        this.nav.push(ProjectPage, { id: id });
    };
    viewProfile  (id) {
        this.nav.push(UserPage, { id: id });
    };

    switchTabs() {
        this.nav.parent.select(4);
    }

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
       // this.takePicture();
    };
    /*
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
    */
    
}
