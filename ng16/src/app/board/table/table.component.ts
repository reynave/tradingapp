import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ConfigService } from 'src/app/service/config.service';
import { FunctionsService } from 'src/app/service/functions.service';
import Chart from 'chart.js/auto';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
export class NewSelect {
  constructor(
    public value: string, 
    public field: string, 
    public journalId: string, 
    public color: string,  
  ) { }
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent implements OnInit {
  @ViewChild('canvasRight') canvasRight: any;
  @ViewChild('contentEditSelect') contentEditSelect: any;

  leftSide: boolean = true;
  panels = ['First', 'Second', 'Third'];
  fields: any = [];
  items: any = [];

  item = new Model("", 0, "", "", "");
  id: string = "";
  waiting: boolean = false;
  loading: boolean = false;
  detail: any = [];
  myTimeout: any;
  select: any = [];
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
  startUpTable: boolean = false;
  isCheckBoxAll: boolean = false;

  newSelect = new NewSelect("","","","");
  backgroundColorOption : any = [];
  
  constructor(
    private http: HttpClient,
    public functionsService: FunctionsService,
    private configService: ConfigService,
    private modalService: NgbModal,
    private ativatedRoute: ActivatedRoute,
    private router: Router,
    private offcanvasService: NgbOffcanvas,
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
    this.httpGet(true);
  }

  httpGet(recalulate: boolean = false) {
    this.http.get<any>(environment.api + "Tables/detail?id=" + this.id, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.backgroundColorOption = data['backgroundColorOption'];
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
        this.select = data['select'];
        this.item.url = environment.api + '?share=' + data['item']['url'];

        if (recalulate == true) {
          // this.onCalculation();
        }
        this.startUpTable = true;
      },
      e => {
        console.log(e);
      }
    )
  }

  detailObject : any = [];
  onChild(newItem: any) {
    //console.log(this.detail[newItem.index]);
    console.log("Saving...", this.waiting);
    console.log(newItem);
   
    if (newItem['itype'] == 'note') {
      this.detailObject = newItem;
      this.openCanvasRight();
    }else if (newItem['itype'] == 'editSelect') {
      this.detailObject = newItem;
      this.newSelect.field = this.detailObject.select.field;
      this.newSelect.journalId = this.detailObject.customField.journalId;
      
      this.modalService.open(this.contentEditSelect, { centered: true });
    } else { 
      this.detail[newItem.index]["f" + newItem.customField.f] = newItem.value;
      if (this.waiting == false) {
        this.waiting = true;
        this.myTimeout = setTimeout(() => {
          this.waiting = false;
          this.loading = true;
          const body = {
            id: this.id,
            newItem: newItem,
          }
          this.http.post<any>(environment.api + 'CustomField/updateData', body,
            { headers: this.configService.headers() }
          ).subscribe(
            data => {
              console.log(data);
              this.loading = false;
              console.log("onSubmit Done");
            },
            e => {
              console.log(e);
            },
          );

        }, 100);
      }
    }
  }

  onSubmit() {
    clearTimeout(this.myTimeout);

    this.loading = true;
    const body = {
      id: this.id,
      item: this.item,
      detail: this.detail,
    }
    this.http.post<any>(environment.api + 'Tables/onSubmit', body,
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

  // openCanvas(content: any) {
  //   this.offcanvasService.open(content, { position: 'end', panelClass: 'details-panel', }).result.then(
  //     (result) => {
  //       console.log("load data");
  //     },
  //     (reason) => {

  //     },
  //   );
  // }

  openCanvasRight() {
    this.offcanvasService.open(this.canvasRight, { position: 'end', panelClass: 'details-panel', }).result.then(
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

  objItem(customField: any, detail: any, index: number) {

    let objIndex = this.select.findIndex(((obj: { field: string; }) => obj.field == 'f' + customField['f']));

    const data = {
      index: index,
      id: detail.id,
      customField: customField,
      itype: customField['iType'],
      value: detail['f' + customField['f']],
      select: this.select[objIndex],
    }
    return data;
  }

  checkBoxAll(status: boolean = false) {
    if (status == true) {
      this.isCheckBoxAll = true;
      this.detail = this.detail.map((item: any) => ({
        ...item,
        checkbox: true,
      }));
    }
    else if (status == false) {
      this.isCheckBoxAll = false;
      this.detail = this.detail.map((item: any) => ({
        ...item,
        checkbox: false,
      }));
    }
  }

}
