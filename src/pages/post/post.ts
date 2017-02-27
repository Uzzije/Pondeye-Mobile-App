import {Component, ViewChild} from '@angular/core';
import {NavController, ActionSheetController, Platform, Content} from 'ionic-angular';

import {PostService} from '../../services/post-service';
import {UserPage} from "../user/user";

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  @ViewChild(Content) content: Content;

  public post: any;
  public comment: any;

  constructor(public nav: NavController, public postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform) {

  }

  toggleLike(post) {
    // if user liked
    if (post.liked) {
      post.likeCount--;
    } else {
      post.likeCount++;
    }

    post.liked = !post.liked
  }

  // on click, go to user timeline
  viewUser(userId) {
    this.nav.push(UserPage, {id: userId})
  }

  // comment to post
  postComment() {
    // add comment
    this.post.comments.push(
      {
        user_id: 2,
        name: 'Ben Sparrow',
        face: 'assets/img/user/ben.png',
        liked: false,
        likeCount: 1,
        time: 'Just now',
        content: this.comment
      });

    // clear input
    this.comment = '';

    // scroll to bottom
    setTimeout(() => {
      // scroll to bottom
      this.content.scrollToBottom();
    }, 200)
  }

  showActions() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            console.log('Delete clicked');
          }
        },
        {
          text: 'Share',
          icon: !this.platform.is('ios') ? 'share' : null,
          handler: () => {
            console.log('Share clicked');
          }
        },
        {
          text: 'Favorite',
          icon: !this.platform.is('ios') ? 'heart-outline' : null,
          handler: () => {
            console.log('Favorite clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
