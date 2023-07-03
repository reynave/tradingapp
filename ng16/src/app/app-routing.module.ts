import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard  } from 'src/app/service/auth.guard';

import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { BacktestComponent } from './backtest/backtest.component';
import { BacktestDetailComponent } from './backtest/backtest-detail/backtest-detail.component';
import { ReloginComponent } from './login/relogin/relogin.component';
import { JournalComponent } from './journal/journal.component';
import { BookComponent } from './book/book.component';

const routes: Routes = [
  { path: "", component: HomeComponent, data: { active: "home" },  canActivate:[authGuard]  }, 
  { path: "home", component: HomeComponent, data: { active: "home" },  canActivate:[authGuard]  }, 
 
  { path: "login", component: LoginComponent, data: { active: "" },  canActivate:[]  }, 
  { path: "relogin", component: ReloginComponent, data: { active: "" },  canActivate:[]  }, 

  
  { path: "book/:id", component: BookComponent, data: { active: "book" },  canActivate:[authGuard]  }, 
 

  { path: "journal", component: JournalComponent, data: { active: "journal" },  canActivate:[authGuard]  }, 
 

  { path: "backtest", component: BacktestComponent, data: { active: "backtest" },  canActivate:[authGuard]  }, 
  { path: "backtest/:id", component: BacktestDetailComponent, data: { active: "backtest" },  canActivate:[authGuard]  }, 
 
  { path: "**", component: NotFoundComponent, data: { active: "404" },  canActivate:[]  }, 
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash :true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
