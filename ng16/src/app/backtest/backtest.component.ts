import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ConfigService } from 'src/app/service/config.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-backtest',
  templateUrl: './backtest.component.html',
  styleUrls: ['./backtest.component.css']
})
export class BacktestComponent implements OnInit {
  items : any = [];
  loading : boolean = false;
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.httpGet();
  }

  httpGet(){
    this.http.get<any>(environment.api+"backtest/index",{
      headers : this.configService.headers()
    }).subscribe(
      data=>{
        this.items = data['items'];
        console.log(data);
      },
      e=>{
        console.log(e);
      }
    )
  }

  onCreateNew(){
    const body ={
      insert : true,
    }
    this.http.post<any>(environment.api+"backtest/onCreateNew",body,{
      headers : this.configService.headers()
    }).subscribe(
      data=>{
     //   this.items = data['items'];
        this.httpGet();
      },
      e=>{
        console.log(e);
      }
    )
  }

}
