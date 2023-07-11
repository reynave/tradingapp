import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ConfigService } from 'src/app/service/config.service';
import { FunctionsService } from 'src/app/service/functions.service';
import Chart from 'chart.js/auto';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

export class Model {
  constructor(
    public name: string,
    public permissionId: number,
    public url: string,
    public borderColor: string,
    public backgroundColor: string,
  ) { }
}

@Component({
  selector: 'app-backtest-detail',
  templateUrl: './backtest-detail.component.html',
  styleUrls: ['./backtest-detail.component.css']
})
export class BacktestDetailComponent implements OnInit {
  getProperties(_t195: any): any {
    throw new Error('Method not implemented.');
  }
  item = new Model("", 0, "", "", "");
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
  customField: any = [];
  chart: any = [];
  chartJsData = {
    data: [],
    label: [],
  }
  detailImageUrl: string = "";
  journalDetailId: string = "";
  constructor(
    private http: HttpClient,
    public functionsService: FunctionsService,
    private configService: ConfigService,
    private modalService: NgbModal,
    private ativatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Load data',
            data: [],
          },
        ],
      },
      
      options: {
        // animation: {
        //   duration: 0
        // },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    this.id = this.ativatedRoute.snapshot.params['id'];
    this.market(); 
    this.httpGet(true); 
  } 

  httpGet(recalulate : boolean = false) {
    this.http.get<any>(environment.api + "backtest/detail?id=" + this.id, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        this.customField = data['customField'];
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

        this.item.name = data['item']['name'];
        this.item.permissionId = data['item']['permissionId'];
        this.item.borderColor = data['item']['borderColor'];
        this.item.backgroundColor = data['item']['backgroundColor'];

        this.item.url = environment.api + '?share=' + data['item']['url'];

        if(recalulate == true){
          this.onCalculation();
          
        }
       
      },
      e => {
        console.log(e);
      }
    )
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

  addCustomField() {
    const body = {
      id: this.id,
    }
    this.http.post<any>(environment.api + 'backtest/addCustomField', body,
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

  removeCustomeFlied(x: any) {
    const body = {
      bcfId: x.id,
      id: this.id,
    }
    console.log(body);
    this.http.post<any>(environment.api + 'backtest/removeCustomeFlied', body,
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

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  valueFromCustomField(field: string, index: number) {
    return this.detail[index]["f" + field];
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
    this.http.post<any>(environment.api + 'backtest/onSubmit', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log("onSubmit Done"); 
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
    winrate: 0,
    win: 0,
    loss: 0,
    totalPip: 0,
    consecutiveWin: 0,
    consecutiveLoss: 0,
    averageRr: 0,
    avaregeTradingTime: 0,
    longestTradingTime: 0,
    fasterTradingTime: 9999999,
    bestWin: 0,
    worstLoss: 0,
  }

  onCalculation() {
    this.summary.totalPip = 0;
    this.summary.totalRr = 0;
    this.summary.consecutiveWin = 0;
    this.summary.consecutiveLoss = 0;
    this.summary.averagePip = 0;
    this.summary.averageRr = 0;
    this.summary.win = 0;
    this.summary.loss = 0;
    let saveWin = 0;
    let i = 0;

    let hourDifference = 0;
    this.deleteAll = false;

    const chartLabel: any = [];
    const chartData: any = [];

    let totalPip = 0;
    chartLabel.push(0);
    chartData.push(0);

    this.detail.forEach((el: any) => {

      totalPip += parseFloat(el['tp']);
      chartLabel.push(i + 1);
      chartData.push(totalPip);

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


      if (this.summary.bestWin < parseFloat(el['tp'])) {
        this.summary.bestWin = parseFloat(el['tp']);
      }
      if (this.summary.worstLoss > parseFloat(el['tp']) && parseFloat(el['tp']) < 0) {
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

      if (this.summary.longestTradingTime < hourDifference) {
        this.summary.longestTradingTime = hourDifference;
      }
      if (this.summary.fasterTradingTime > hourDifference) {
        this.summary.fasterTradingTime = hourDifference;
      }
      i++;
    });

    this.summary.winrate = (this.summary.win / i) * 100;
    this.summary.avaregeTradingTime = hourDifference / i;
    this.summary.averageRr = this.summary.totalRr / i;
    this.summary.averagePip = this.summary.totalPip / i;
    this.chartJsData = {
      label: chartLabel,
      data: chartData,
    }
    console.log(this.chartJsData);
    this.chartJsUpdate();
  }
  chartJsUpdate() {
    this.chart.data.labels = this.chartJsData.label;
    this.chart.data.datasets = [
      {
        label: this.item.name,
        data: this.chartJsData.data, 
        borderColor: this.item.borderColor,
        backgroundColor: this.item.backgroundColor,
        fill: {above: '#98EECC', below: '#FFAAC9', target: {value: 0}},
      },
    ];

    this.chart.update();
  }

  onUpdate() {
    this.onCalculation();
    this.onCalculation();
    console.log("Saving...", this.waiting);

    if (this.waiting == false) {
      this.waiting = true;
      this.myTimeout = setTimeout(() => {
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

  openImg(content: any, x: any) {
    this.detailSelect = x;
    console.log(this.detailSelect);
    this.journalDetailId = x.id;
    this.router.navigate(['backtest', this.id], { queryParams: { journalDetailId: x.id } }).then(
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
      journalDetailId: x.journalDetailId,
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


  openFullscreen(content: any, url: string) {
    this.modalService.dismissAll();
    this.detailImageUrl = url;
    this.modalService.open(content, { fullscreen: true });
  }

  backGalleries(content: any) {
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
      formData.append("journalDetailId", this.journalDetailId);
      formData.append("table", "pages");
      formData.append("token", "123");
      const upload$ = this.http.post(environment.api + "/upload/uploadImages", formData);
      upload$.subscribe(
        data => {
          console.log(data);
          this.httpNote = "";
          this.http.get<any>(environment.api + 'backtest/detailImages?id=' + this.journalDetailId,
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
  back() {
    history.back();
  }
 
}
