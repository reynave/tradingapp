import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/service/config.service';
import Chart from 'chart.js/auto';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustomFieldFormComponent } from 'src/app/template/custom-field-form/custom-field-form.component';
import { Observable, of } from 'rxjs';

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
  x: any = [];
  y: any = [];
  iWhere: any = [];
  whereOption: any = [];
  chart: any = [];
  totalData :number = 0;
  permission: any = [];
  startUpTable: boolean = false;
  detailObject: any = [];
  typeOfChart: any = [];
  customFieldForm: any = [];
  chartJsData: any = [];
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
    this.id = this.ativatedRoute.snapshot.queryParams['id'];
    this.journalTableViewId = this.ativatedRoute.snapshot.queryParams['journalTableViewId']; 
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

  httpHeader() {
    this.http.get<any>(environment.api + "Tables/header" , {
      headers: this.configService.headers(),
      params : {
        id : this.id
      }
    }).subscribe(
      data => {
        //    console.log("httpHeader",data); 

        this.customFieldForm = data['customField']; 
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
        this.journalChart.chartjsTypeId = data['journal_chart']['chartjsTypeId'];
        this.journalChart.xAxis = data['journal_chart']['xaxis'];
        this.journalChart.idWhere = data['journal_chart']['idWhere'];

        //this.detail = data['detail'];
        this.x = data['x'];
        this.y = data['y'];
        this.iWhere = data['iWhere'];
        this.typeOfChart = data['typeOfChart'];
        if (recalulate == true) {
          // this.onCalculation();
        }
        this.startUpTable = true;
        this.chartJsData = data['chartJsData'];
        this.totalData = data['totalData'];
        // if (this.journalChart.chartjsTypeId == 1) {
        this.initChartJs();


        // this.chartJsUpdate();
        // }
      },
      e => {
        console.log(e);
      }
    )
  }

  initChartJs() {
    // console.log("initChartJs", this.chart['canvas'], this.journalChart.chartjsTypeId);
    if (this.chart['canvas'] !== undefined) {
      this.chart.destroy();
    }
    let objIndex = this.typeOfChart.findIndex(((obj: { id: any; }) => obj.id == this.journalChart.chartjsTypeId));
    if (objIndex > -1) {
      this.chart = new Chart('canvas', {
        type: this.typeOfChart[objIndex]['itype'],
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
            x: {
              ticks: {
                maxRotation: 90,
                minRotation: 0
              }
            }
          },
          plugins: {
            tooltip: {
              enabled: this.totalData > 100 ? false : true // <-- this option disables tooltips
            }
          }
        },
      });
      this.chartJsUpdate();
    }

    //console.log(this.chart);
  }



  chartJsUpdate() {
    //console.log("chartJsUpdate", this.chart['canvas']);

    //  this.chart.type = "bar";
    this.chart.data.labels = this.chartJsData['labels'];
    this.chart.data.datasets = [];

    this.chartJsData['datasets'].forEach((el: any) => {
      this.chart.data.datasets.push(
        {
          label: el['label'],
          data: el['data'],
          //  borderColor: this.item.borderColor,
          //  backgroundColor: this.item.backgroundColor,
          // type: 'bar',
          fill: el['fill'] == true ? { above: '#98EECC', below: '#FFAAC9', target: { value: 0 } } : false,
        },
      )
    });

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
        this.httpGet(); 
      },
      e => {
        console.log(e);
      }
    )
  }


}
