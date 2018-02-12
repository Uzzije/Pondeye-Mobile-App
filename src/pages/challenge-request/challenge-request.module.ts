import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChallengeRequestPage } from './challenge-request';

@NgModule({
  declarations: [
    ChallengeRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(ChallengeRequestPage),
  ],
})
export class ChallengeRequestPageModule {}
