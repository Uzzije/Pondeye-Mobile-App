import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController, AlertController,  Platform } from 'ionic-angular';
import {UserService} from '../../services/user-service';
import {SearchService} from '../../services/search-service';
import {ProjectService} from '../../services/project-service';
import { ProjectPage } from '../project-page/project-page';
/**
 * Generated class for the ProjectsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html',
})
export class ProjectsPage {
  private queryWord = "";
  private loader: any;
  private base64Image;
  private milestones = [];
  private noResult = false;
  // get sample data only
  private userID;
  private resultData;
  private dataResult;
  private publicSearch = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserService,  private params: NavParams, 
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, public searchService: SearchService, public projectService: ProjectService) {

      this.userID = this.navParams.get('id');
      this.publicSearch = this.params.get('public');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectsPage');
  }

  ngOnInit(): void {
    var subcription = this.projectService.getAllProjects(this.userID, this.publicSearch).subscribe((data) => {
        //console.log("search word ", this.queryWord);
        this.resultData = JSON.parse(data);
        console.log(this.resultData);
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

  findProject (ev) {
    var queryWord = ev.target.value;
    if (queryWord.length > 0) {
        var subcription = this.searchService.getProjectResult(this.queryWord).subscribe((data) => {
          //console.log("search word ", this.queryWord);
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
          var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
      }, () => {
          console.log("Finished! ");
          
      });
    }
  }
  

  viewProject(Id){
      this.navCtrl.push(ProjectPage, {id:Id});
  }
  showAlert  (mes) {
    var alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: mes,
        buttons: ['OK']
    });
    alert.present();
  };
}
