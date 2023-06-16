import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ConfigService } from 'src/app/service/config.service';
import { FunctionsService } from 'src/app/service/functions.service';

import { ActivatedRoute } from '@angular/router';
import { NgbAlertModule, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class Model {
  constructor(
    public name: string,
    public permissionId: number,
  ) { }
}

@Component({
  selector: 'app-backtest-detail',
  templateUrl: './backtest-detail.component.html',
  styleUrls: ['./backtest-detail.component.css']
})
export class BacktestDetailComponent implements OnInit {
  item = new Model("", 0);
  id: string = "";
  waiting: boolean = false;
  loading: boolean = false;
  detail: any = [];
  selectMarket: any = [];
  myTimeout: any;
  chart: any = {
    title: "linechart",
    type: "LineChart",
    data: [
      [1, 137.8,],
      [2, 30.9,],
      [3, 25.4,],
      [4, 11.7,],
      [5, 11.9,],
      [6, 8.8,],
    ],
    options: {
      legend: { position: 'none' },
      //https://developers.google.com/chart/interactive/docs/gallery/linechart
    }
  }
  constructor(
    private http: HttpClient,
    private functionsService: FunctionsService,
    private configService: ConfigService,
    
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    
    this.market();
    this.httpGet();
  }

  market() {
    this.http.get<any>(environment.api + "market/index", {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        this.selectMarket = data['selectMarket'];
      },
    )
  }

  httpGet() {
    this.http.get<any>(environment.api + "backtest/detail?id=" + this.id, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        this.detail = data['detail'].map((item: any) => ({
          ...item,
          openDate: {
            year: new Date(item.openDate).getFullYear(),
            month: new Date(item.openDate).getMonth() + 1,
            day: new Date(item.openDate).getDate(), 
          },
          closeDate: {
            year: new Date(item.closeDate).getFullYear(),
            month: new Date(item.closeDate).getMonth() + 1,
            day: new Date(item.closeDate).getDate()
          },
          openTime: item.openDate.split(" ")[1].substring(0, 5),
          closeTime: item.closeDate.split(" ")[1].substring(0, 5),
        }));
        this.onCalculation();

        this.item.name = data['item']['name'];
        this.item.permissionId = data['item']['permissionId'];
        //this.detail = mappedData;
        console.log(data);
      },
      e => {
        console.log(e);
      }
    )
  }

  fnAddItems() {
    const body = {
      id: this.id, 
    }
    this.http.post<any>(environment.api + 'backtest/fnAddItems', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data);
        this.httpGet();
      },
      e => {
        console.log(e);
      },
    );
  }

  onSubmit() {
    clearTimeout(this.myTimeout);
    this.loading = true;
    const body = {
      id: this.id,
      item: this.item,
      detail: this.detail,
    }
    console.log("onSubmit", body);
    this.http.post<any>(environment.api + 'backtest/onSubmit', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data);
      },
      e => {
        console.log(e);
      },
    );
  }

  copyToOpenDate(item: any, i: any) {
    console.log(i, item);
    this.detail[i]['closeDate'] = item['openDate'];
    this.onUpdate();
  }

  summary: any = {
    i: 0,
    totalPip: 0,
    consecutiveWin: 0,
    consecutiveLoss: 0,
    averageRr: 0,
    avaregeTradingTime : 0,
  }

  onCalculation() {
    this.summary.totalPip = 0;
    this.summary.totalRr = 0;

    this.summary.consecutiveWin = 0;
    this.summary.consecutiveLoss = 0;
    this.summary.averagePip = 0;
    this.summary.averageRr = 0;
    let saveWin = 0;
    let i = 0;
    let hourDifference = 0;
    this.detail.forEach((el: any) => {
      this.summary.totalPip += parseFloat(el['tp']);
      this.summary.totalRr += parseFloat(el['rr']); 
      this.detail[i]['tp'] =  this.detail[i]['rr'] *  this.detail[i]['sl'];
      if(this.detail[i]['tp']<0) {
        this.detail[i]['resultId'] = -1;
      }else  if(this.detail[i]['tp']>0) {
        this.detail[i]['resultId'] = 1;
      }else if(this.detail[i]['tp'] == 0){
        this.detail[i]['resultId'] = 0;
      }
    
      
     
      if (el['resultId'] > 0) {
        saveWin++;
      } else {
        saveWin = 0;
      }

      if (el['resultId'] < 0) {
        this.summary.consecutiveLoss++;
      } else {
        this.summary.consecutiveLoss = 1;
      }

      if( this.summary.consecutiveWin < saveWin){
        this.summary.consecutiveWin = saveWin;
      }
      let openTime = {
        hour : el['openTime'].split(":")[0],
        minute: el['closeTime'].split(":")[1],
      }
      let closeTime = {
        hour : el['closeTime'].split(":")[0],
        minute: el['closeTime'].split(":")[1],
      }
      hourDifference += this.functionsService.getHourDifference(el['openDate'],openTime, el['closeDate'],closeTime);
      console.log(hourDifference);
  
      i++;
      
    });
    this.summary.avaregeTradingTime = hourDifference / i;
    this.summary.averageRr = this.summary.totalRr / i;
    this.summary.averagePip = this.summary.totalPip / i;
  }

 

  onUpdate() {
   this.onCalculation();
    this.chart.data = [
      [1, 137.8,],
      [2, 130.9,],
      [3, 25.4,],
      [4, 11.7,],
      [5, 11.9,],
      [6, 128.8,],
    ];

    console.log("waiting...", this.waiting);
    if (this.waiting == false) {
      this.waiting = true;
      this.myTimeout = setTimeout(() => {
        console.log(this.item);
        this.waiting = false;
        this.onSubmit();
      }, 2000);
    }

  }
}
