import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/service/config.service';
import Chart from 'chart.js/auto';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustomFieldFormComponent } from 'src/app/template/custom-field-form/custom-field-form.component';

export class Model {
  constructor(
    public name: string,
    public permissionId: number,
    public url: string,
    public borderColor: string,
    public backgroundColor: string,

  ) { }
}

export class JournalChart {
  constructor(
    public chartjsTypeId: number,
    public idWhere: string,
    public xAxis: string,
    public yAxis: any,
    public whereOption: any,

  ) { }
}

@Component({
  selector: 'app-chartjs',
  templateUrl: './chartjs.component.html',
  styleUrls: ['./chartjs.component.css']
})
export class ChartjsComponent implements OnInit {
  @ViewChild('canvasRight') canvasRight: any;
  @ViewChild('contentEditSelect') contentEditSelect: any;


  items: any = [];
  journal: any = [];
  item = new Model("", 0, "", "", "");
  journalChart = new JournalChart(0, "", "", [], []);

  id: string = "";
  journalTableViewId: string = "";

  waiting: boolean = false;
  loading: boolean = false;
  detail: any = [];
  myTimeout: any;
  httpNote: string = "";
  fileName = "";
  x: any = [];
  y: any = [];
  iWhere: any = [];
  whereOption: any = [];
  chart: any = [];
  chartJsData = {
    data: [],
    label: [],
  }
  permission: any = [];
  detailImageUrl: string = "";
  journalDetailId: string = "";
  startUpTable: boolean = false;
  detailObject: any = [];
  typeOfChart: any = [];
  customFieldForm: any = [];
  constructor(
    private titleService: Title,
    private http: HttpClient,
    private configService: ConfigService,
    private modalService: NgbModal,
    private ativatedRoute: ActivatedRoute,
    private router: Router,
    private offcanvasService: NgbOffcanvas,
  ) { }

  ngOnInit(): void {

    this.id = this.ativatedRoute.snapshot.params['id'];
    this.journalTableViewId = this.ativatedRoute.snapshot.params['journalTableViewId'];

    this.httpHeader();
    this.httpGet(true);
   

  }

  reload(newItem: any) {
    this.startUpTable = false;
    console.log(newItem);
    this.journalTableViewId = newItem['id'];
    this.httpHeader();
    this.httpGet(true);

  }

  initChartJs() {
    console.log(this.chart);
    const typeChart = 'line';
    this.chart = new Chart('canvas', {
      type: typeChart,
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
        animation: {
          duration: 0
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    console.log(this.chart);
  }

  httpHeader() {
    this.http.get<any>(environment.api + "Tables/header?id=" + this.id, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        //    console.log("httpHeader",data);
        this.journal = data['item'];
        this.titleService.setTitle(data['item']['name']);
        this.item.name = data['item']['name'];

        this.customFieldForm = data['customField'];
        this.item.permissionId = data['item']['permissionId'];
        this.permission = data['permission'];
        this.item.url = environment.api + '?share=' + data['item']['url'];
      },
      e => {
        console.log(e);
      }
    )
  }

  httpGet(recalulate: boolean = false) {
    this.http.get<any>(environment.api + "Chart/detail", {
      headers: this.configService.headers(),
      params: {
        id: this.id,
        journalTableViewId: this.journalTableViewId,
      }
    }).subscribe(
      data => {

        console.log("httpGet", data);
        this.journalChart.chartjsTypeId = data['journal_chart_type']['chartjsTypeId'];
        this.journalChart.xAxis = data['journal_chart_type']['xaxis'];
        this.journalChart.idWhere = data['journal_chart_type']['idWhere'];

        this.detail = data['detail'];
        this.x = data['x'];
        this.y = data['y'];
        this.iWhere = data['iWhere'];
        this.typeOfChart = data['typeOfChart'];
        if (recalulate == true) {
          // this.onCalculation();
        }
        this.startUpTable = true;
        console.log("journalChart", this.journalChart);

        if (this.journalChart.chartjsTypeId == 1) {
          this.initChartJs();
          this.chartJsUpdate();
        }
      },
      e => {
        console.log(e);
      }
    )
  }

  chartJsUpdate() {
  //  this.chart.type = "bar";
    this.chart.data.labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    this.chart.data.datasets = [
      {
        label: "data Lable 1",
        data: [0, -21, -43, -64, 20, -1, -23, -45, 39, 123, 102, 80],
        //  borderColor: this.item.borderColor,
        //  backgroundColor: this.item.backgroundColor,
       // type: 'bar',
        fill: { above: '#98EECC', below: '#FFAAC9', target: { value: 0 } },
      },
      {
        label: "data Lable 2",
        data: [-23, -45, 39, 123, 102, 80,0, -21, -43, -64, 20, -1, ],
        //type: 'bar',
        //  borderColor: this.item.borderColor,
        //  backgroundColor: this.item.backgroundColor,
        //  fill: {above: '#98EECC', below: '#FFAAC9', target: {value: 0}},
      },
    ];

    this.chart.update();
    // setTimeout(() => {
    //   this.chart.destroy();
    // }, 2000);
  }
  onSubmit() {
    clearTimeout(this.myTimeout);
    this.loading = true;
    const body = {
      id: this.id,
      item: this.item,
    }
    console.log(body);
    this.http.post<any>(environment.api + 'Tables/onSubmit', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log("onSubmit Done");
        this.httpHeader();
      },
      e => {
        console.log(e);
      },
    );
  }

  openCanvasRight() {
    this.offcanvasService.open(this.canvasRight, { position: 'end', panelClass: 'details-panel', }).result.then(
      (result) => {
        console.log("load data");
      },
      (reason) => {

      },
    );
  }

  fnPermission(id: number) {
    let data = [];
    if (this.permission.length > 0) {
      let objIndex = this.permission.findIndex(((obj: { id: number; }) => obj.id == id));
      this.permission[objIndex]['name'];
      data = this.permission[objIndex];
    }

    return data;
  }

  openComponent(componentName: string) {
    if (componentName == 'CustomFieldFormComponent') {
      const modalRef = this.modalService.open(CustomFieldFormComponent, { fullscreen: true });
      modalRef.componentInstance.customFieldForm = this.customFieldForm;
      modalRef.componentInstance.id = this.id;
    }
  }

  onChild(newItem: any) {
    console.log("return from child ", newItem);
  }

  iWhereOption: any = [];
  returniWhereOption() {
    this.iWhereOption = [];
    if (this.journalChart.idWhere != "") {
      let objIndex = this.iWhere.findIndex(((obj: { key: any; }) => obj.key == this.journalChart.idWhere));
      if (objIndex > -1) this.iWhereOption = this.iWhere[objIndex]['option'];
    }
    return this.iWhereOption;
  }

  updateChartJs() {
    if (this.journalChart.idWhere != "") {
      let objIndex = this.iWhere.findIndex(((obj: { key: any; }) => obj.key == this.journalChart.idWhere));
      this.iWhereOption = this.iWhere[objIndex]['option'];
    }
    const whereOption = this.journalChart['idWhere'] == "" ? [] : this.iWhereOption;

    this.journalChart.yAxis = this.y;
    this.journalChart.yAxis = this.y;
    this.journalChart.whereOption = whereOption;

    const body = {
      id: this.id,
      journalTableViewId: this.journalTableViewId,
      journalChart: this.journalChart,
    }
    console.log(body);
    this.http.post<any>(environment.api + "Chart/updateChartJs", body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
      },
      e => {
        console.log(e);
      }
    )
  }


}
