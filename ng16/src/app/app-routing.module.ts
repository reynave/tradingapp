import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard  } from 'src/app/service/auth.guard';

import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { BacktestComponent } from './backtest/backtest.component';
import { BacktestDetailComponent } from './backtest/backtest-detail/backtest-detail.component';
import { ReloginComponent } from './login/relogin/relogin.component'; 
import { BookComponent } from './book/book.component'; 
import { TemplateTableComponent } from './template/template-table/template-table.component';
import { TableComponent } from './board/table/table.component';
import { ChartjsComponent } from './board/chartjs/chartjs.component';

const routes: Routes = [
  { path: "", component: HomeComponent, data: { active: "home" },  canActivate:[authGuard]  }, 
 
  { path: "login", component: LoginComponent, data: { active: "" },  canActivate:[]  }, 
  { path: "relogin", component: ReloginComponent, data: { active: "" },  canActivate:[]  }, 

  { path: "invited", component: ReloginComponent, data: { active: "" },  canActivate:[]  }, 



  { path: "home", component: HomeComponent, data: { active: "home" },  canActivate:[authGuard]  }, 
  { path: "book", component: BookComponent, data: { active: "book", name :'shareToMe' },  canActivate:[authGuard]  }, 
  { path: "book/:id", component: BookComponent, data: { active: "book" },  canActivate:[authGuard]  },
  { path: "board/table/:id/:journalTableViewId", component: TableComponent, data: { active: "board" },  canActivate:[authGuard]  }, 
  { path: "board/chart/:id/:journalTableViewId", component: ChartjsComponent, data: { active: "board" },  canActivate:[authGuard]  }, 

  { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule), canActivate:[authGuard] },


  // TEMPLATE FOR "DEVELOPMENT" UX UI DESIGN
  { path: "template/table", component: TemplateTableComponent, data: { active: "template" },  canActivate:[authGuard]  }, 
  
  // VERSI LAMA, AKAN TIDAK DIPAKAH UNTUK KENANGAN SAJA
  { path: "backtest", component: BacktestComponent, data: { active: "backtest" },  canActivate:[authGuard]  }, 
  { path: "backtest/:id", component: BacktestDetailComponent, data: { active: "backtest" },  canActivate:[authGuard]  }, 
 
  { path: "**", component: NotFoundComponent, data: { active: "404" },  canActivate:[]  }, 
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash :true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
