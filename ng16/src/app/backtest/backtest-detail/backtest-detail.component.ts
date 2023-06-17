import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ConfigService } from 'src/app/service/config.service';
import { FunctionsService } from 'src/app/service/functions.service';

import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  detailSelect: any = [];
  httpNote: string = "";
  fileName = "";
  deleteAll: boolean = false;
  chart: any = {
    title: "linechart",
    type: "LineChart",
    data: [],
    options: {
      legend: { position: 'none' },
      //https://developers.google.com/chart/interactive/docs/gallery/linechart
    }
  }
  constructor(
    private http: HttpClient,
    private functionsService: FunctionsService,
    private configService: ConfigService,
    private modalService: NgbModal,
    private ativatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.id = this.ativatedRoute.snapshot.params['id']; 
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
          checkbox: false,

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
        this.httpGet();
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
    winrate : 0,
    win : 0,
    loss : 0,
    totalPip: 0,
    consecutiveWin: 0,
    consecutiveLoss: 0,
    averageRr: 0,
    avaregeTradingTime: 0,
    longestTradingTime : 0,
    fasterTradingTime : 9999999,
    bestWin : 0,
    worstLoss : 0,
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
    let win = 0;
    let hourDifference = 0;
    this.deleteAll = false;

    const chartData: number[][] = [];
    let totalPip = 0;
    chartData.push([0, 0 ]);
    this.detail.forEach((el: any) => {

      totalPip += parseFloat(el['tp']);
      chartData.push([i+1, totalPip ]);

      if (el['checkbox'] == true) this.deleteAll = true;
      this.summary.totalPip += parseFloat(el['tp']);
      this.summary.totalRr += parseFloat(el['rr']);
      this.detail[i]['tp'] = this.detail[i]['rr'] * this.detail[i]['sl'];
      if (this.detail[i]['tp'] < 0) {
        this.detail[i]['resultId'] = -1;
      } else if (this.detail[i]['tp'] > 0) {
        this.detail[i]['resultId'] = 1;
      } else if (this.detail[i]['tp'] == 0) {
        this.detail[i]['resultId'] = 0;
      }


      if(this.summary.bestWin < parseFloat(el['tp']) ){
        this.summary.bestWin = parseFloat(el['tp']);
      }
      if(this.summary.worstLoss > parseFloat(el['tp'])  &&  parseFloat(el['tp']) < 0){
        this.summary.worstLoss = parseFloat(el['tp']);
      }


      this.detail[i]['tradingTime'] = parseFloat(this.detail[i]['tradingTime']).toFixed(0);

      if (el['resultId'] > 0) {
        saveWin++;
        this.summary.win++;
      } else {
        saveWin = 0;
      }

      if (el['resultId'] < 0) {
        this.summary.loss++;
      }

      if (el['resultId'] < 0) {
        this.summary.consecutiveLoss++;
      } else {
        this.summary.consecutiveLoss = 1;
      }

      if (this.summary.consecutiveWin < saveWin) {
        this.summary.consecutiveWin = saveWin;
      }
      let openTime = {
        hour: el['openTime'].split(":")[0],
        minute: el['closeTime'].split(":")[1],
      }
      let closeTime = {
        hour: el['closeTime'].split(":")[0],
        minute: el['closeTime'].split(":")[1],
      }
      hourDifference += this.functionsService.getHourDifference(el['openDate'], openTime, el['closeDate'], closeTime);
     
      this.detail[i]['tradingTime'] = hourDifference;

      if(this.summary.longestTradingTime < hourDifference){
        this.summary.longestTradingTime = hourDifference;
      }
      if(this.summary.fasterTradingTime > hourDifference){
        this.summary.fasterTradingTime = hourDifference;
      }

      i++;

    });
    console.log(saveWin);
    this.summary.winrate = (this.summary.win / i) * 100; 
    this.summary.avaregeTradingTime = hourDifference / i;
    this.summary.averageRr = this.summary.totalRr / i;
    this.summary.averagePip = this.summary.totalPip / i;
    console.log(chartData);

    this.chart.data = chartData;
    
  }

  onUpdate() {
    this.onCalculation();  
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

  fnDeleteAll() {
    if (confirm("Delete selected ?")) {
      this.loading = true;
      const body = {
        detail: this.detail,
      }
      console.log(body);
      this.http.post<any>(environment.api + 'backtest/fnDeleteAll', body,
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
  }

  open(content: any) {
    console.log(this.detailSelect);
    this.modalService.open(content, { size: 'xl' });
  }

  backtestDetailId: string = "";
  openImg(content: any, x: any) {
    this.detailSelect = x;
    console.log(this.detailSelect);
    this.backtestDetailId = x.id;
    this.router.navigate(['backtest', this.id], { queryParams: { backtestDetailId: x.id } }).then(
      () => {
        this.http.get<any>(environment.api + 'backtest/detailImages?id=' + x.id,
          { headers: this.configService.headers() }
        ).subscribe(
          data => {
            console.log(data);
            this.detailSelect = data['detailImages'];
            this.modalService.open(content, { size: 'xl' });
          },
          e => {
            console.log(e);
          },
        );
      }
    )
  }

  removeImages(x: any) {
    const body = {
      id: x.id,
      backtestDetailId: x.backtestDetailId,
    }
    this.http.post<any>(environment.api + 'backtest/removeImages?', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data);
        this.detailSelect = data['detailImages'];
      },
      e => {
        console.log(e);
      },
    );
  }

  detailImageUrl: string = "";
  openFullscreen(content: any, url: string) {
    this.modalService.dismissAll();
    this.detailImageUrl = url;
    this.modalService.open(content, { fullscreen: true });
  }

  backGalleries(content: any){
    this.modalService.dismissAll();
    this.modalService.open(content, { size: 'xl' });
  }

 
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.httpNote = "Upload..";
      console.log(file);
      this.fileName = file.name;
      const formData = new FormData();

      formData.append("userfile", file);
      formData.append("backtestDetailId", this.backtestDetailId);
      formData.append("table", "pages");
      formData.append("token", "123");
      const upload$ = this.http.post(environment.api + "/upload/uploadImages", formData);
      upload$.subscribe(
        data => {
          console.log(data);
          this.httpNote = "";
          this.http.get<any>(environment.api + 'backtest/detailImages?id=' + this.backtestDetailId,
            { headers: this.configService.headers() }
          ).subscribe(
            data => {
              this.detailSelect = data['detailImages'];
            },
            e => {
              console.log(e);
            },
          );
        },
        e => {
          this.httpNote = "Upload error!";
          console.log(e)
        });
    }
  }
}
