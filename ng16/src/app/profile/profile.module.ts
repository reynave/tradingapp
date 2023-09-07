import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module'; 
import { TeamComponent } from './team/team.component';
import { LeftSideProfileComponent } from './global-profile/left-side-profile/left-side-profile.component';
import { FormsModule } from '@angular/forms';
import { UserComponent } from './user/user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LanguageRegionComponent } from './language-region/language-region.component';
import { SessionComponent } from './session/session.component';
 

@NgModule({
  declarations: [ 
    TeamComponent,
    LeftSideProfileComponent,
    UserComponent,
    LanguageRegionComponent,
    SessionComponent, 
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    NgbModule
    
  ]
})
export class ProfileModule { }
