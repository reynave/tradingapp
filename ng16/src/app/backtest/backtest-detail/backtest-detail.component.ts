import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ConfigService } from 'src/app/service/config.service';
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

  chart: any = {
    title: "linechart",
    type: "LineChart",
    data: [
      [1, 37.8,],
      [2, 30.9,],
      [3, 25.4,],
      [4, 11.7,],
      [5, 11.9,],
      [6, 8.8,],
    ],
    option: {
      theme: 'maximized',
      chart: {
        title: 'Box Office Earnings in First Two Weeks of Opening',
        subtitle: 'in millions of dollars (USD)'
      },
      chartArea:  { 
         
      }
      // width: 900,
      //height: 500
    }
  }
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log(this.route.snapshot.params['id'])
    this.httpGet();
  }

  httpGet() {
    this.http.get<any>(environment.api + "backtest/detail?id=" + this.id, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        this.item.name = data['item']['name'];
        this.item.permissionId = data['item']['permissionId'];
        this.detail = data['detail'];
        console.log(data);
      },
      e => {
        console.log(e);
      }
    )
  }

  onSubmit() {
    clearTimeout(this.myTimeout);
    this.loading = true;
    const body = {
      id: this.id,
      item: this.item,
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
    // if(this.detail[i]['closeDate'] == ""){
    console.log(i, item);
    this.detail[i]['closeDate'] = item['openDate'];
    //  }

  }

  myTimeout: any;
  onUpdate() {
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
