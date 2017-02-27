var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var core_1 = require('@angular/core');
var user_1 = require("../user/user");
var new_post_1 = require("../new-post/new-post");
var ionic_native_1 = require('ionic-native');
var milestone_page_1 = require('../milestone-page/milestone-page');
var project_page_1 = require('../project-page/project-page');
var search_result_page_1 = require('../search-result-page/search-result-page');
var pictureUpload_1 = require('../pictureUpload/pictureUpload');
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
var ActivityPage = (function () {
    // set sample data
    function ActivityPage(nav, postService, actionSheetCtrl, platform, loadingCtrl, alertCtrl, newPostService) {
        // set sample data
        this.nav = nav;
        this.postService = postService;
        this.actionSheetCtrl = actionSheetCtrl;
        this.platform = platform;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.newPostService = newPostService;
        // list of posts
        this.feeds = [];
        this.vouchCountList = [];
        this.followCountList = [];
        this.idList = [];
        this.queryWord = "";
        this.loader = loadingCtrl.create({
            content: "Getting ponders fitness activities..."
        });
        this.loader.present();
    }
    ActivityPage.prototype.ngOnInit = function () {
        var subcription = this.postService.getUserFeed().subscribe(function (data) {
            this.feedData = JSON.parse(data);
            //console.log(this.feedData);
            if (this.feedData.status == false) {
                var alert_1 = this.showAlert(this.feedData.error);
            }
            this.feeds = this.feedData.all_feeds;
            if (this.feeds) {
                this.hasFeed = true;
                var nextFeed;
                var nextId;
                console.log("feed length ", this.feeds.length);
                for (var item = 0; item < this.feeds.length; item++) {
                    nextFeed = this.feeds[item];
                    nextId = nextFeed.id;
                    if (nextFeed.is_milestone_feed) {
                        this.vouchCountList[nextId] = nextFeed.vouch_count;
                    }
                    if (nextFeed.is_project_feed) {
                        this.followCountList[nextId] = nextFeed.follow_count;
                    }
                }
            }
        }, function (error) {
            this.loader.dismiss();
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, function () {
            console.log("Finished! ");
            this.loader.dismiss();
        });
    };
    ;
    ActivityPage.prototype.ngAfterViewInit = function () {
        var idNext;
        /*
        $(this.input.nativeElement).find("section").twentytwenty({
              default_offset_pct: 0.9
        });
        this.imgList.changes.subscribe(
          (result) => {
              result.forEach((img_item: ElementRef) => {
                  $(img_item.nativeElement).twentytwenty();
                  
            })
          }
        )
    
        /*
        for(var item = 0; item < this.idList.length; item++){
            idNext = this.idList[item];
            console.log("I acame I saw and conquered!");
    
             $(this.input.nativeElement).find("section").twentytwenty({
              default_offset_pct: 0.9
            });
           // $(this.input.nativeElement).find(".img"+idNext).twentytwenty({
              //default_offset_pct: 0.9
            //});
            
        }
        */
        //this.loader.dismiss();
    };
    ;
    ActivityPage.prototype.ionViewDidLoad = function () {
        /*
        this.imgList.forEach((img_item: ElementRef) =>{
            $(img_item.nativeElement).twentytwenty({
              default_offset_pct: 0.9
           });
           console.log("I am printing ish out!!");
        })
        */
    };
    ActivityPage.prototype.showAlert = function (mes) {
        var alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: mes,
            buttons: ['OK']
        });
        alert.present();
    };
    ActivityPage.prototype.createVouch = function (mil_Id) {
        console.log("create vouch id ", mil_Id);
        var subcription = this.postService.postNewVouch(mil_Id).subscribe(function (data) {
            var vouchData = JSON.parse(data);
            console.log(vouchData);
            if (vouchData.status == false) {
                var alert_2 = this.showAlert(vouchData.error);
            }
            else {
                this.vouchCountList[mil_Id] = vouchData.count;
                console.log(" vouch count", this.vouchCountList[mil_Id]);
            }
        }, function (error) {
            var alert = this.showAlert("Oops. Something Went Wrong! Restart the app!");
        }, function () { return console.log("Finished! " + this.feedData); });
    };
    ActivityPage.prototype.createFollow = function (proj_Id) {
        var subcription = this.postService.postNewFollow(proj_Id).subscribe(function (data) {
            var followData = JSON.parse(data);
            console.log(followData);
            if (followData.status == false) {
                var alert_3 = this.showAlert(followData.error);
            }
            else {
                this.followCountList[proj_Id] = followData.count;
            }
        }, function (error) {
            var alert = this.showAlert("Oops. Something Went Wrong! Check your connection!");
        }, function () { return console.log("Finished! " + this.feedData); });
    };
    ;
    ActivityPage.prototype.viewMilestone = function (feedId) {
        this.nav.push(milestone_page_1.MilestonePage, { id: feedId });
        console.log(feedId, " feed id");
    };
    ;
    /*
    viewPictureSet(feedId){
        this.nav.push(PostPage, {id: feedId});
    }
  */
    ActivityPage.prototype.viewProject = function (feedId) {
        this.nav.push(project_page_1.ProjectPage, { id: feedId });
    };
    ;
    ActivityPage.prototype.search = function (ev) {
        var queryWord = ev.target.value;
        if (queryWord.length > 0) {
            this.nav.push(search_result_page_1.SearchResultPage, { queryWord: queryWord });
            console.log(this.queryWord, " query word");
        }
    };
    // on click, go to user timeline
    ActivityPage.prototype.viewUser = function (userId) {
        this.nav.push(user_1.UserPage, { id: userId });
    };
    ActivityPage.prototype.viewProfile = function (id) {
        this.nav.push(user_1.UserPage, { id: id });
    };
    // create a new post
    ActivityPage.prototype.createPost = function () {
        this.nav.push(new_post_1.NewPostPage);
    };
    ActivityPage.prototype.createPicture = function () {
        this.takePicture();
        this.nav.push(pictureUpload_1.NewPictureUploadPage, { 'fileName': this.base64Image });
    };
    ActivityPage.prototype.takePicture = function () {
        ionic_native_1.Camera.getPicture({
            destinationType: ionic_native_1.Camera.DestinationType.DATA_URL,
            mediaType: ionic_native_1.Camera.MediaType.PICTURE,
            encodingType: ionic_native_1.Camera.EncodingType.JPEG,
            correctOrientation: true
        }).then(function (imageData) {
            this.base64Image = "data:image/jpeg;base64," + imageData;
            this.nav.push(pictureUpload_1.NewPictureUploadPage, { 'fileName': this.base64Image });
        }, function (err) {
            console.log(err);
        });
    };
    ActivityPage = __decorate([
        core_1.Component({
            selector: 'page-activity',
            templateUrl: 'activity.html'
        })
    ], ActivityPage);
    return ActivityPage;
})();
exports.ActivityPage = ActivityPage;
//# sourceMappingURL=activity.js.map