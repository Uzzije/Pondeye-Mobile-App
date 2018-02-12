import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'; 

// import services
import {UserService} from '../services/user-service';
import {ChatService} from '../services/chat-service';
import {NotificationService} from '../services/notification-service';
import {NewPostServices} from '../services/new-post-service';
import {AuthenticateService} from '../services/authenticate-service';
import {PictureUploadService} from '../services/pictureUploadService';
import {PondService} from '../services/pond-service';
import {SearchService} from '../services/search-service';
import {PostService} from '../services/post-service';
import {SettingsService} from '../services/settings-service';
import {FriendService} from '../services/friend-service';
import {ProjectService} from '../services/project-service';
// end import services

// import pages
import {WelcomePage} from '../pages/welcome/welcome';
import {LoginPage} from '../pages/login/login';
import {LogoutPage} from '../pages/logout/logout';
import {UserPage} from '../pages/user/user';
import {ActivityPage} from '../pages/activity/activity';
import {RegisterPage} from '../pages/register/register';
import {ChatDetailPage} from '../pages/chat-detail/chat-detail';
import {NewPostPage} from '../pages/new-post/new-post';
import {NotificationsPage} from '../pages/notifications/notifications';
import {ContactPage} from '../pages/contact/contact';
import {SettingsPage} from '../pages/settings/settings';
import {PostPage} from "../pages/post/post";
import {MilestonePage} from '../pages/milestone-page/milestone-page';
import {ProjectPage} from '../pages/project-page/project-page';
import {PondPage} from '../pages/pond-page/pond-page';
import {PondsPage} from '../pages/ponds-page/ponds-page';
import {NewPondPage} from '../pages/new-pond-page/new-pond-page';
import {SearchResultPage} from '../pages/search-result-page/search-result-page';
import {AboutPage} from '../pages/about/about';
import {PasswordResetPage} from '../pages/password-reset/password-reset-page';
import {ProjectEditPage} from '../pages/settings/project-edit';
import {MilestoneEditPage} from '../pages/settings/milestone-edit';
import {PondEditPage} from '../pages/settings/pond-edit';
import {PictureEditPage} from '../pages/settings/picture-edit';
import {NewPictureUploadPage} from '../pages/pictureUpload/pictureUpload';
import {PersonalInfoEditPage} from '../pages/settings/personal-info-edit';
import {TermsAndConditionPage} from '../pages/terms-and-condition/terms-and-condition';
import { Ionic2RatingModule } from 'ionic2-rating';
import {TabsPage} from '../pages/tabs/tabs';
import {FriendRequestPage} from '../pages/friend-request/friend-request';
import {ChallengeRequestPage} from '../pages/challenge-request/challenge-request';
import {ChallengeActivityPage} from '../pages/challenge-activity/challenge-activity';
import {NotificationTabPage} from '../pages/notification-tabs/notification-tabs';
import { FriendsPage } from '../pages/friends/friends';
import { ProjectsPage } from '../pages/projects/projects';
import {EntryPage} from '../pages/entry/entry';
import {VideoUploadModalPage} from '../pages/videoUploadModal/videoUploadModal';

// end import pages

@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    LoginPage,
    RegisterPage,
    ActivityPage,
    AboutPage,
    PasswordResetPage,
    UserPage,
    LogoutPage,
    TermsAndConditionPage,

    NewPostPage,
    MilestonePage,
    ProjectPage,
    PondPage,
    PondsPage,
    NewPondPage,
    NotificationsPage,
    NewPictureUploadPage,
    FriendRequestPage,
    ChallengeActivityPage,
    ChallengeRequestPage,
    FriendsPage,
    ProjectsPage,
    SearchResultPage,
    

    SettingsPage,
    ProjectEditPage,
    MilestoneEditPage,
    PictureEditPage,
    PersonalInfoEditPage,
    PondEditPage,

    TabsPage,
    NotificationTabPage,
    EntryPage,
    VideoUploadModalPage
    /* import pages */
  ],
  imports: [
    BrowserModule,
    HttpModule,
    Ionic2RatingModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    LoginPage,
    RegisterPage,
    ActivityPage,
    AboutPage,
    PasswordResetPage,
    UserPage,
    LogoutPage,
    TermsAndConditionPage,

    NewPostPage,
    MilestonePage,
    ProjectPage,
    PondPage,
    PondsPage,
    NewPondPage,
    NotificationsPage,
    NewPictureUploadPage,
    ChallengeRequestPage,
    ChallengeActivityPage,
    FriendsPage,
    ProjectsPage,
    SearchResultPage,
    

    SettingsPage,
    ProjectEditPage,
    MilestoneEditPage,
    PictureEditPage,
    PersonalInfoEditPage,
    PondEditPage,

    TabsPage,
    NotificationTabPage,
    FriendRequestPage,
    EntryPage,
    VideoUploadModalPage
    /* import pages */
  ],
  providers: [
    UserService,
    PostService,
    ChatService,
    NotificationService,
    AuthenticateService,
    NewPostServices,
    PictureUploadService,
    PondService,
    SearchService,
    PostService,
    SettingsService,
    FriendService,
    ProjectService
    /* import services */

  ]
})
export class AppModule {
}
