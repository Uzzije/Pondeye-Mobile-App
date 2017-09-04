import {Component, ViewChild} from '@angular/core';
import {Platform} from 'ionic-angular';
import {Keyboard} from '@ionic-native/keyboard';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
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
import {SettingsPage} from '../pages/settings/settings'; 
import {PondsPage} from '../pages/ponds-page/ponds-page';
import {NewPondPage} from '../pages/new-pond-page/new-pond-page';
import {AboutPage} from '../pages/about/about';
import {CURRENTURL} from '../services/service-util/URLS';

// end import pages



@Component({
  templateUrl: 'app.html',
  providers: [Keyboard, SplashScreen, StatusBar],
  queries: {
    nav: new ViewChild('content')
  }
})

export class MyApp {
  public userName = localStorage.getItem("username");
  public userProfilePic = CURRENTURL + localStorage.getItem("profile_url");
  public hasNotif = 0;
  public rootPage: any;
  
  public nav: any;

  public pages = [
           {
                title: 'Feed',
                icon: 'md-trending-up',
                count: 0,
                component: ActivityPage
            },
            {
                title: 'Create New Pond',
                icon: 'md-add-circle',
                count: 0,
                component: NewPondPage  
            },
            {
                title: 'My Ponds',
                icon: 'ios-people',
                count: 0,
                component: PondsPage ,
            },
            {
                title: 'My Entries',
                icon: 'book',
                count: 0,
                component:  SettingsPage
            },
            {
                title: 'Notifications',
                icon: 'ios-notifications-outline',
                count: this.hasNotif,
                component: NotificationsPage 
            },
            {
                title: 'About/Help',
                icon: 'help-circle',
                count: 0,
                component:  AboutPage
            },
            {
                title: 'Login',
                icon: 'ios-log-in-outline',
                count: 0,
                component: LoginPage
            },
            {
                title: 'Logout',
                icon: 'ios-log-out-outline',
                count: 0,
                component:LogoutPage
            },

    // import menu
  ];

  constructor(public platform: Platform, private keyboard: Keyboard, 
            private splashScreen: SplashScreen, private statusBar: StatusBar) {
    this.rootPage = WelcomePage;
    this.keyboard.disableScroll(true);
        platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        if (this.platform.is('android')) {
            
            this.platform.registerBackButtonAction(() => {
                window['plugins'].appMinimize.minimize();
            });
        }
        statusBar.styleDefault();
        }).catch((err)=>{
            console.log(err);
        });
        this.platform.registerBackButtonAction(function () {
                    window['plugins'].appMinimize.minimize();
        });
        /*
        if (this.splashScreen) {
            setTimeout(function () {
                this.splashScreen.hide();
            }, 100);
        }
        */
    }

    openPage(page){
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.userProfilePic = CURRENTURL + localStorage.getItem("profile_url");
        if(localStorage.getItem("notification_length")){
            this.pages[4]['count'] = parseInt(localStorage.getItem("notification_length"))
            this.hasNotif = parseInt(localStorage.getItem("notification_length"));
        }else{
            this.hasNotif = 0;
        }
        
        this.nav.setRoot(page.component);
    }
    openProfilePage(){
        this.userProfilePic = CURRENTURL + localStorage.getItem("profile_url");
        this.nav.setRoot(UserPage);
    }

}
