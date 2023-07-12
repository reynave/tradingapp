import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ConfigService } from 'src/app/service/config.service';
import { FunctionsService } from 'src/app/service/functions.service';
import Chart from 'chart.js/auto';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbOffcanvas, NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

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
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  leftSide: boolean = true;
  panels = ['First', 'Second', 'Third'];
  fields: any = [];
  items: any = [];

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
    private offcanvasService: NgbOffcanvas,
    private calendar: NgbCalendar
  ) { }

  onChild(newItem: any) {
    console.log(newItem)
  }

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

    // for (let i = 0; i < 100; i++) {
    //   this.items.push({
    //     id: i + 1,
    //     name: "test " + i,
    //     itype: (i % 5 == 0) ? 'select' : 'text',
    //     value: "value " + i,
    //   });
    // }
    // for (let i = 0; i < 15; i++) {
    //   this.fields.push({
    //     id: i + 1,
    //     name: "Name_" + (i * 7),
    //   });

    // }
    // console.log(this.items);
    this.httpGet(true);
  }

  httpGet(recalulate: boolean = false) {
    this.http.get<any>(environment.api + "backtest/detail?id=" + this.id, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
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

        if (recalulate == true) {
          // this.onCalculation();
        }

      },
      e => {
        console.log(e);
      }
    )
  }



  focusSelect() {
    console.log("date");
  }

  openCanvas(content: any) {
    this.offcanvasService.open(content, { position: 'end', panelClass: 'details-panel', }).result.then(
      (result) => {
        console.log("load data");
      },
      (reason) => {

      },
    );
  }


  openModalFullscreen(content: any) {
    this.modalService.open(content, { fullscreen: true }).result.then(
      (result) => {

      },
      (reason) => {

      },
    );

    $(function () {
      $(".resizable").resizable({
        maxHeight: 33,
        minHeight: 33,
      });
      $(".sortable").sortable({
        handle: ".handle",
        placeholder: "ui-state-highlight",
        update: function (event: any, ui: any) {
          const order: any[] = [];
          $(".sortable .handle").each((index: number, element: any) => {
            const itemId = $(element).attr("id");
            order.push(itemId);
          });

          console.log(order);

        }
      });
    });
  }

  update() {
    console.log("update");
  }
  objItem(customField: any, detail: any) {
    const data = { 
      id: detail.id, 
      name: 'test', 
      itype: (detail.id % 5 == 0) ? 'select' : 'text', 
      value: detail['f' + customField['f']], 
    }
    return data;
  }

}
