import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { TeamComponent } from './team/team.component';
import { UserComponent } from './user/user.component';
import { LanguageRegionComponent } from './language-region/language-region.component';
import { SessionComponent } from './session/session.component';
import { SecurityComponent } from './security/security.component';

const routes: Routes = [
  {  path: '',  component: TeamComponent,data: { active: "team" }  },
  {  path: 'team',  component: TeamComponent, data: { active: "team" }  },
  {  path: 'user/:id',  component:  UserComponent, data: { active: "user" }},
  {  path: 'langreg',  component:  LanguageRegionComponent, data: { active: "langreg" }},
  {  path: 'session',  component:  SessionComponent, data: { active: "langreg" }},
  {  path: 'security',  component:  SecurityComponent, data: { active: "security" }},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
