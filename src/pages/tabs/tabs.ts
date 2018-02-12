import {Component} from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import {UserPage} from '../user/user';
import {AboutPage} from '../about/about';
import {ActivityPage} from '../activity/activity';
import { NotificationTabPage } from '../notification-tabs/notification-tabs';
import {SearchResultPage} from '../search-result-page/search-result-page';
import {EntryPage} from '../entry/entry';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = NotificationTabPage ;
  tab2Root: any = ActivityPage;
  tab3Root: any = UserPage;
  tab4Root: any = EntryPage;
  tab5Root: any = SearchResultPage
  constructor() {

  }
}
