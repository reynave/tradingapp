import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { TeamComponent } from './team/team.component';
 

@NgModule({
  declarations: [
    MyProfileComponent,
    TeamComponent, 
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    
  ]
})
export class ProfileModule { }
