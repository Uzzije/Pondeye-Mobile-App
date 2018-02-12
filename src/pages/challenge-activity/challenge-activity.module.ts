import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChallengeActivityPage } from './challenge-activity';

@NgModule({
  declarations: [
    ChallengeActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(ChallengeActivityPage),
  ],
})
export class ChallengeActivityPageModule {}
