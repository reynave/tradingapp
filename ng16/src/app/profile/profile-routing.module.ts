import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { TeamComponent } from './team/team.component';

const routes: Routes = [
  {  path: '',  component: MyProfileComponent  },
  {  path: 'team',  component: TeamComponent  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
