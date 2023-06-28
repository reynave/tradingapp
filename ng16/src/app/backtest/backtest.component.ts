import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ConfigService } from 'src/app/service/config.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-backtest',
  templateUrl: './backtest.component.html',
  styleUrls: ['./backtest.component.css']
})
export class BacktestComponent implements OnInit {
  items: any = [];
  chart: any = [];
  permission : any = [];
  loading: boolean = false;
  item : any = [];
  journalAccess : any = [];
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.httpGet();
    this.myChartjs();
  }

  test() {
    this.chart.destroy();
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: ['start', 'Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [0, 1, 2, 3, 4, 5, 6],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

  }

  myChartjs() {
 
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: ['start', 'Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes 1',
            data: [0, 12, 19, 3, 5, 2, 3],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgb(75, 192, 192)',
          },

          {
            label: '# of Votes 2',
            data: [1, 42, 2, 5, 7, 1, 53],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
          },

          {
            label: '# of Votes 3',
            data: [ 5, 2, 3, 0, 12, 19, 3,],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
   
  }


  httpGet() {
    this.http.get<any>(environment.api + "journal/index", {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        this.permission = data['permission'];
        this.items = data['items'];
        console.log(data);
      },
      e => {
        console.log(e);
      }
    )
  }

  onCreateNew() {
    const body = {
      insert: true,
    }
    this.http.post<any>(environment.api + "journal/onCreateNew", body, {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data);
        //   this.items = data['items'];
        this.httpGet();
      },
      e => {
        console.log(e);
      }
    )
  }

  onUpdatePermission(x :any){
    console.log(x, this.item);
    const body = {
      permission : x,
      item : this.item,
    }
    this.http.post<any>(environment.api + "journal/onUpdatePermission", body, {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data);
        this.item['fontIcon'] = x.fontIcon;
         this.item['permission'] = x.name;
        
        this.httpGet();
      },
      e => {
        console.log(e);
      }
    )
  }

  open(content: any, x: any) {
    this.item = x;
    this.http.get<any>(environment.api + "journal/access?journalId="+x.id, {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data);
        this.journalAccess = data['journal_access'];
        this.modalService.open(content, { size:'md'});
      
      },
      e => {
        console.log(e);
      }
    )
		
	}
  fnRemovePresence(){
    const body = {
      remove: true,
    }
    this.http.post<any>(environment.api + "journal/fnRemovePresence", body, {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data); 
        this.httpGet();
      },
      e => {
        console.log(e);
      }
    )
  }
  fnDeleteAll(){
    if(confirm("Delete all check list ?") ){
      const body = {
        items: this.items,
      }
      this.http.post<any>(environment.api + "journal/fnDeleteAll", body, {
        headers: this.configService.headers()
      }).subscribe(
        data => {
          console.log(data); 
          this.httpGet();
        },
        e => {
          console.log(e);
        }
      )
    }
  }
}
