import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/service/config.service';
import { FunctionsService } from 'src/app/service/functions.service';
import Chart from 'chart.js/auto';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustomFieldFormComponent } from 'src/app/template/custom-field-form/custom-field-form.component';
declare var $: any;


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
  @HostListener('window:popstate', ['$event'])
  // onPopState(event: any) {
  //   console.log("POP");
  //   this.reload(this.journalTableViewId);
  // }
  // onPushState(event: any) {
  //   console.log("PUSH");
  //   this.reload(this.journalTableViewId);
  // }

  leftSide: boolean = true;

  fields: any = [];

  newCustomField = new NewCustomField("", "text");
  id: string = "";
  journalTableViewId: string = "";

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
  tools: boolean = false;
  detailImageUrl: string = "";
  journalDetailId: string = "";
  startUpTable: boolean = false;
  isCheckBoxAll: boolean = false;
  detailObject: any = [];
  newSelect = new NewSelect("", "", "", "#393737");
  backgroundColorOption: any = [];
  archives: number = 0;
  //tableFooter: any = [];
  customFieldKey: any = [];
  users: any = [];

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
    this.journalTableViewId = this.ativatedRoute.snapshot.params['journalTableViewId'];

    this.httpHeader();
    this.httpGet(true);
    this.httpJournalSelect();

  }

  reload(newItem: any) {
    this.id = this.ativatedRoute.snapshot.params['id'];
    this.journalTableViewId = this.ativatedRoute.snapshot.params['journalTableViewId'];

    this.startUpTable = false;
    console.log(newItem);
    this.journalTableViewId = newItem['id'];
    this.httpHeader();
    this.httpGet(true);
    this.httpJournalSelect();
  }

  httpHeader() {
    this.http.get<any>(environment.api + "Tables/header", {
      headers: this.configService.headers(),
      params: {
        id: this.id
      }
    }).subscribe(
      data => {
        this.customFieldForm = data['customField'];
      },
      e => {
        console.log(e);
      }
    )
  }

  httpGet(recalulate: boolean = false) {
    this.http.get<any>(environment.api + "Tables/detail", {
      headers: this.configService.headers(),
      params: {
        id: this.id,
        journalTableViewId: this.journalTableViewId,
      }
    }).subscribe(
      data => {
        console.log("httpGet", data);
        this.archives = data['archives'];
        this.backgroundColorOption = data['backgroundColorOption'];
        this.customField = data['customField'];
        this.customFieldKey = data['customFieldKey'];

        this.detail = data['detail'];

        // this.httpDataFormula();
        this.select = data['select'];
        this.users = data['select'];

        // if (recalulate == true) {
        // this.onCalculation();
        //}

        this.startUpTable = true;
        let self = this;
        $(function () {
          $(".sortable").sortable({
            handle: ".handle",
            placeholder: "ui-state-highlight",
            cancel: ".handle-disabled",
            update: function (event: any, ui: any) {
              const order: any[] = [];
              $(".handle").each((index: number, element: any) => {
                const itemId = $(element).attr("id");
                order.push(itemId);
              });
              console.log(order);
              const body = {
                order: order,
                journalId: self.id,
              }

              self.http.post<any>(environment.api + "Tables/sortableDetail", body, {
                headers: self.configService.headers(),
              }).subscribe(
                data => {
                  //self.httpGet();
                  console.log(data);
                },
                e => {
                  console.log(e);
                }
              )
            }
          });
        });
        this.calculationFooter();
      },
      e => {
        console.log(e);
      }
    )
  }

  calculationFooter() {
    let i = 0;

    this.customField.forEach((el: any) => {
      let value = 0;
      this.detail.forEach((item: any) => {
        if (el['iType'] == 'number' || el['iType'] == 'formula') {
          value += parseFloat(item[el['key']]);
        }
      });
      const total = {
        key: el['key'],
        iType: el['iType'],
        total: parseFloat(value.toFixed(2))
      }
      if (el['iType'] == 'number' || el['iType'] == 'formula') {
        this.customField[i]['total'] = new Intl.NumberFormat('en-US').format(parseFloat(value.toFixed(2)));
      }
      // this.tableFooter.push(total);
      i++;
    });
    console.log(this.detail);
  }

  httpCustomField() {
    this.http.get<any>(environment.api + "Tables/detail", {
      headers: this.configService.headers(),
      params: {
        id: this.id,
        journalTableViewId: this.journalTableViewId,
      }
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
    }
    else if (newItem['itype'] == 'editSelect') {
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
    }
    else {

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

  addTask() {
    const body = {
      journalId: this.id,
    }
    this.http.post<any>(environment.api + "Tables/addTask", body, {
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

  actionTask(action: string) {
    const detail = [];
    for (let i = 0; i < this.detail.length; i++) {
      if (this.detail[i].checkbox == true) {
        let temp = {
          id: this.detail[i]['id'],
        }
        detail.push(temp);
      }
    }
    const body = {
      detail: detail,
    }
    console.log(body);
    if (action == 'delete') {
      detail.forEach(el => {
        var objIndex = this.detail.findIndex(((obj: { id: any; }) => obj.id == el['id']));
        this.detail.splice(objIndex, 1);
      });
      this.http.post<any>(environment.api + "Tables/deleteTask", body, {
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
    if (action == 'duplicate') {
      this.http.post<any>(environment.api + "Tables/duplicateTask", body, {
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
    if (action == 'lock') {
      detail.forEach(el => {
        var objIndex = this.detail.findIndex(((obj: { id: any; }) => obj.id == el['id']));
        this.detail[objIndex]['ilock'] = "1";
      });
      this.http.post<any>(environment.api + "Tables/lock", body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          console.log(data);
          this.checkBoxAll(false);
        },
        e => {
          console.log(e);
        }
      )
    }
    if (action == 'unlock') {
      detail.forEach(el => {
        var objIndex = this.detail.findIndex(((obj: { id: any; }) => obj.id == el['id']));
        this.detail[objIndex]['ilock'] = "0";
      });
      this.http.post<any>(environment.api + "Tables/unlock", body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          console.log(data);
          this.checkBoxAll(false);
        },
        e => {
          console.log(e);
        }
      )
    }
    if (action == 'archives') {
      detail.forEach(el => {
        var objIndex = this.detail.findIndex(((obj: { id: any; }) => obj.id == el['id']));
        this.detail[objIndex]['archives'] = "1";
        this.archives++;
      });
      this.http.post<any>(environment.api + "Tables/archives", body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          console.log(data);
          this.checkBoxAll(false);
        },
        e => {
          console.log(e);
        }
      )
    }
    if (action == 'unarchives') {
      const bodyAll = {
        id: this.id,
      }
      console.log(bodyAll)
      this.http.post<any>(environment.api + "Tables/unarchives", bodyAll, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          console.log(data);
          this.checkBoxAll(false);
          this.httpGet();
        },
        e => {
          console.log(e);
        }
      )
    }

  }

  reloadRow(data: any) {
    console.log("reloadRow ", data);
    let objIndex = this.detail.findIndex(((obj: { id: any; }) => obj.id == data.id));
    this.detail[objIndex] = data;
    this.calculationFooter();
  }

  reloadAddRow(data: any) {
    this.detail.push(data);
  }

  reloadDelRow(data: any) {
    data.forEach((el: any) => {
      let objIndex = this.detail.findIndex(((obj: { id: any; }) => obj.id == el));
      this.detail.move(objIndex, 0);
    });

  }

  httpJournalSelect() {
    this.http.get<any>(environment.api + "Tables/journal_select?id=" + this.id, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        // console.log("httpJournalSelect",data);
        //this.customField = data['customField'];
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

  fnHide(n: number, index: number, item: any) {
    console.log(n, index);
    this.customField[index]['hide'] = n == 1 ? 0 : 1;
    const data = {
      item: item,
      hide: this.customField[index]['hide'],
      id: this.id,
      journalTableViewId: this.journalTableViewId,
    }
    this.http.post<any>(environment.api + "Tables/fnHide", data, {
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

  openCanvasRight() {
    this.offcanvasService.open(this.canvasRight, { position: 'end', panelClass: 'details-panel', }).result.then(
      (result) => {
        console.log("load data");
      },
      (reason) => {

      },
    );
  }

  objItem(customField: any, detail: any, index: number) {

    let objIndex = this.select.findIndex(((obj: { field: string; }) => obj.field == 'f' + customField['f']));

    const data = {
      index: index,
      id: detail.id,
      ilock: detail.ilock == '1' ? true : false,
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

      // for (let i = 0; i < this.detail.length; i++) {
      //   this.detail[i].checkbox = true;
      // }
      this.detail.forEach((el: any) => {
        el.checkbox = true;
      });
    }
    else if (status == false) {
      this.isCheckBoxAll = false;

      // for (let i = 0; i < this.detail.length; i++) {
      //   this.detail[i].checkbox = false;
      // }
      this.detail.forEach((el: any) => {
        el.checkbox = false;
      });
    }
    this.tools = this.isCheckBoxAll;
  }

  fnTools() {
    this.tools = false;
    this.detail.forEach((el: any) => {
      if (el.checkbox == true) {
        this.tools = true;
        return;
      }
    });
  }

  openComponent(componentName: string) {
    if (componentName == 'CustomFieldFormComponent') {
      const modalRef = this.modalService.open(CustomFieldFormComponent, { fullscreen: true });
      modalRef.componentInstance.customFieldForm = this.customFieldForm;
      modalRef.componentInstance.id = this.id;
      modalRef.componentInstance.journalTableViewId = this.journalTableViewId;

      modalRef.componentInstance.newItemEvent.subscribe((data: any) => {
        console.log(data);
        if (data == 'httpGet') {
          this.httpGet();
        }
        else if (data == 'httpCustomField') {
          this.httpCustomField();
        }
      });
    }
  }

  // fnDetailTotal(customField: any) {
  //   let objIndex = this.tableFooter.findIndex(((obj: { key: any; }) => obj.key == customField.key)); 
  //   let value = customField.name;
  //   if(customField.iType == 'number' || customField.iType == 'formula'){
  //      value = new Intl.NumberFormat('en-US').format(this.tableFooter[objIndex]['total']); 
  //   }
  //   return value ;
  // }

}
