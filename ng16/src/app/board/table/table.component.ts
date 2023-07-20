import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ConfigService } from 'src/app/service/config.service';
import { FunctionsService } from 'src/app/service/functions.service';
import Chart from 'chart.js/auto';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { LoginComponent } from 'src/app/login/login.component';
import { CustomFieldFormComponent } from 'src/app/template/custom-field-form/custom-field-form.component';
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
export class NewCustomField {
  constructor(
    public name: string,
    public iType: string,
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
  journal: any = [];
  item = new Model("", 0, "", "", "");
  newCustomField = new NewCustomField("", "text");
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
  customFieldForm: any = [];

  chart: any = [];
  chartJsData = {
    data: [],
    label: [],
  }
  permission: any = [];
  detailImageUrl: string = "";
  journalDetailId: string = "";
  startUpTable: boolean = false;
  isCheckBoxAll: boolean = false;
  detailObject: any = [];
  newSelect = new NewSelect("", "", "", "#393737");
  backgroundColorOption: any = [];

  constructor(
    private titleService: Title,
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
    this.httpHeader();
    this.httpGet(true);
    this.httpJournalSelect();

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
        this.item.permissionId = data['item']['permissionId'];
        this.permission = data['permission'];
        this.customFieldForm = data['customField'];
        this.item.borderColor = data['item']['borderColor'];
        this.item.backgroundColor = data['item']['backgroundColor'];
        this.item.url = environment.api + '?share=' + data['item']['url'];
      },
      e => {
        console.log(e);
      }
    )
  }

  httpGet(recalulate: boolean = false) {
    this.http.get<any>(environment.api + "Tables/detail?id=" + this.id, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log("httpGet",data);
        this.backgroundColorOption = data['backgroundColorOption'];
        this.customField = data['customField'];
        this.detail = data['detail'];
        // this.detail = data['detail'].map((item: any) => ({
        //   ...item,
        //   checkbox: false,
        //   openDate: {
        //     year: new Date(item.openDate).getFullYear(),
        //     month: new Date(item.openDate).getMonth() + 1,
        //     day: new Date(item.openDate).getDate(),
        //   },
        //   closeDate: {
        //     year: new Date(item.closeDate).getFullYear(),
        //     month: new Date(item.closeDate).getMonth() + 1,
        //     day: new Date(item.closeDate).getDate()
        //   },
        //   openTime: item.openDate.split(" ")[1].substring(0, 5),
        //   closeTime: item.closeDate.split(" ")[1].substring(0, 5),
        // }));
        this.select = data['select'];
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

  httpCustomField() {
    this.http.get<any>(environment.api + "Tables/detail?id=" + this.id, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        this.customField = data['customField'];
      },
      e => {
        console.log(e);
      }
    )
  }


  onChild(newItem: any) {
    //console.log(this.detail[newItem.index]);
    console.log("Saving...", this.waiting);
    console.log("return from child ", newItem);

    if (newItem['itype'] == 'note') {
      this.detailObject = newItem;
      this.openCanvasRight();
    } else if (newItem['itype'] == 'editSelect') {
      this.detailObject = newItem;
      this.newSelect.field = this.detailObject.select.field;
      this.newSelect.journalId = this.detailObject.customField.journalId;

      this.modalService.open(this.contentEditSelect, { centered: true });
      let self = this;
      $(function () {
        $(".sortableSelect").sortable({
          handle: ".handleSelect",
          placeholder: "ui-state-highlight",
          update: function (event: any, ui: any) {
            const order: any[] = [];
            $(".sortableSelect .handleSelect").each((index: number, element: any) => {
              const itemId = $(element).attr("id");
              order.push(itemId);
            });
            console.log(order);
            const body = {
              order: order,
              journalId: self.id,
            }
            self.http.post<any>(environment.api + "CustomField/updateSortableSelect", body, {
              headers: self.configService.headers(),
            }).subscribe(
              data => {
                // self.customField = data['customField'];
                // self.select = data['select']; 
                self.httpJournalSelect();
              },
              e => {
                console.log(e);
              }
            )
          }
        });
      });
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
              this.reloadRow(data['detail'][0]);
              console.log("onSubmit Done");
            },
            e => {
              console.log(e);
            },
          );

        }, 500);
      }
    }
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

  addTask(){
    const body = {
      journalId : this.id,
    }
    this.http.post<any>(environment.api + "Tables/addTask" , body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.reloadAddRow(data['detail'][0]);
      },
      e => {
        console.log(e);
      }
    )
  }

  reloadRow(data:any){
    console.log("reloadRow");
    let objIndex = this.detail.findIndex(((obj: { id: any; }) => obj.id == data.id));
    this.detail[objIndex] = data;
  }
  reloadAddRow(data:any){
    this.detail.push(data);
  }
  reloadDelRow(data:any){
    data.forEach((el: any) => {
      let objIndex = this.detail.findIndex(((obj: { id: any; }) => obj.id == el));
      this.detail.move(objIndex,0);
    });
    
  }

  httpJournalSelect() {
    this.http.get<any>(environment.api + "Tables/journal_select?id=" + this.id, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        // console.log("httpJournalSelect",data);
        this.customField = data['customField'];
        this.select = data['select'];
        if (this.detailObject.length !== 0) {
          let objIndex = this.select.findIndex(((obj: { field: any; }) => obj.field == this.detailObject.select.field));
          this.detailObject.select = this.select[objIndex];
          console.log(this.detailObject.select, this.select);
        }

      },
      e => {
        console.log(e);
      }
    )
  }

  onUpdateSelect(data: any) {
    console.log(data);
    this.http.post<any>(environment.api + "CustomField/updateSelect", data, {
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

  onDeleteSelect(data: any) {
    console.log(data);
    this.http.post<any>(environment.api + "CustomField/deleteSelect", data, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.httpJournalSelect();
      },
      e => {
        console.log(e);
      }
    )
  }

  addInsertSelect() {
    this.http.post<any>(environment.api + "CustomField/insertSelect", this.newSelect, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        this.detailObject.select.option = data['option'];
        this.httpJournalSelect();
        this.newSelect.value = "";
      },
      e => {
        console.log(e);
      }
    )
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

  openModalFullscreen(content: any) {
    this.modalService.open(content, { fullscreen: true });
    this.customFieldForm = this.customField;
    let self = this;
    $(function () {
      $(".resizable").resizable({
        maxHeight: 33,
        minHeight: 33,
        minWidth: 100,
        stop: function (event: any, ui: any) {
          console.log(ui.size);
          const body = {
            ui: ui.size,
            itemId: $(this).attr("id")
          }
          console.log(body);
          self.http.post<any>(environment.api + "CustomField/fieldResizable", body, {
            headers: self.configService.headers(),
          }).subscribe(
            data => {
              console.log(data);
              self.httpCustomField();
            },
            e => {
              console.log(e);
            }
          )
        }
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
          self.http.post<any>(environment.api + "CustomField/sortable", order, {
            headers: self.configService.headers(),
          }).subscribe(
            data => {
              console.log(data);
              self.httpGet();
            },
            e => {
              console.log(e);
            }
          )
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
      for (let i = 0; i < this.detail.length; i++) {
        this.detail[i].checkbox = true;
      }
    }
    else if (status == false) {
      this.isCheckBoxAll = false;
      for (let i = 0; i < this.detail.length; i++) {
        this.detail[i].checkbox = false;
      }
    }
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

  openComponent() {
		const modalRef = this.modalService.open(CustomFieldFormComponent, { fullscreen: true});
		modalRef.componentInstance.customFieldForm = this.customFieldForm;
	}

  onUpdateCustomField(x: any) {
    console.log(x);
    this.http.post<any>(environment.api + "CustomField/onUpdateCustomField", x, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.httpCustomField();
      },
      e => {
        console.log(e);
      }
    )
  }

  onUpdateCustomFieldAlign(x:any){
    this.httpGet(); 
    this.httpCustomField();
  }

  addCustomField() {
    const body = {
      id: this.id,
      item: this.newCustomField
    }
    this.http.post<any>(environment.api + 'CustomField/addCustomField', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data);
        if (data['error'] === true) {
          alert(data['note']);
        }
        this.modalService.dismissAll();
        this.httpGet();

      },
      e => {
        console.log(e);
      },
    );
  }

  removeCustomeFlied(x: any) {
    const body = {
      id: x.id,
    }
    console.log(body);
    this.http.post<any>(environment.api + 'CustomField/removeCustomeFlied', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data);
        let objIndex = this.customFieldForm.findIndex(((obj: { id: any; }) => obj.id == x.id));
        this.customFieldForm.splice(objIndex, 1);
        this.httpGet();
      },
      e => {
        console.log(e);
      },
    );
  }

}
