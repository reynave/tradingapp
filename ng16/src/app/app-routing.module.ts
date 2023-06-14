import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { BacktestComponent } from './backtest/backtest.component';
import { BacktestDetailComponent } from './backtest/backtest-detail/backtest-detail.component';

const routes: Routes = [
  { path: "", component: HomeComponent, data: { active: "home" },  canActivate:[]  }, 
  { path: "login", component: LoginComponent, data: { active: "" },  canActivate:[]  }, 

  { path: "backtest", component: BacktestComponent, data: { active: "backtest" },  canActivate:[]  }, 
  { path: "backtest/:id", component: BacktestDetailComponent, data: { active: "backtest" },  canActivate:[]  }, 

  
  { path: "**", component: NotFoundComponent, data: { active: "404" },  canActivate:[]  }, 
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash :true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
