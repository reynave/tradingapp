import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/service/config.service';
import { FunctionsService } from 'src/app/service/functions.service';
import { ActivatedRoute } from '@angular/router';
import { NgbOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomFieldFormComponent } from 'src/app/template/custom-field-form/custom-field-form.component';
import { DetailInterface } from './table-interface';
import { OffCanvasNotesComponent } from './off-canvas-notes/off-canvas-notes.component';
import { OffCanvasImagesComponent } from './off-canvas-images/off-canvas-images.component';
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
export class TableComponent implements OnInit, AfterViewInit { 
  @ViewChild('contentEditSelect') contentEditSelect: any;
  prod = environment.production;
  fields: any = [];

  newCustomField = new NewCustomField("", "text");
  id: string = "";
  journalTableViewId: string = "";

  waiting: boolean = false;
  loading: boolean = false;
  detail: DetailInterface[] = [];
  detailOrigin: DetailInterface[] = [];
  myTimeout: any;
  select: any = [];
  httpNote: string = "";
  fileName = "";
  deleteAll: boolean = false;
  customField: any = [];
  customFieldForm: any = [];

  resizableStatus: boolean = false;
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
  journalAccess: any = [];
  api: string = environment.api;
  constructor( 
    private http: HttpClient,
    public functionsService: FunctionsService,
    private configService: ConfigService,
    private modalService: NgbModal,
    private ativatedRoute: ActivatedRoute, 
    private offcanvasService: NgbOffcanvas,
  ) { }

  ngOnInit(): void {
    this.id = this.ativatedRoute.snapshot.params['id'];
    this.journalTableViewId = this.ativatedRoute.snapshot.params['journalTableViewId'];
    this.httpHeader();

    //this.httpJournalSelect();
    // setTimeout(() =>{
    this.httpDetail(true);
    // },1000);
  }

  reload(newItem: any) {
    this.id = this.ativatedRoute.snapshot.params['id'];
    this.journalTableViewId = this.ativatedRoute.snapshot.params['journalTableViewId'];
    this.startUpTable = false;
    console.log(newItem);
    if (newItem['id']) {
      this.journalTableViewId = newItem['id'];
    } 
    this.httpHeader();
    this.httpDetail(true);
   // this.httpJournalSelect();
  }

  httpHeader() {
    this.http.get<any>(environment.api + "Tables/header", {
      headers: this.configService.headers(),
      params: {
        id: this.id
      }
    }).subscribe(
      data => {
        // console.log("httpHeader", data);
        this.customFieldForm = data['customField'];
        this.journalAccess = data['journal_access'];

      },
      e => {
        console.log(e);
      }
    )
  }

  httpDetail(recalulate: boolean = false) {
    this.http.get<any>(environment.api + "Tables/detail", {
      headers: this.configService.headers(),
      params: {
        id: this.id,
        journalTableViewId: this.journalTableViewId,
      }
    }).subscribe(
      data => {
        console.log('httpDetail', data);
        this.archives = data['archives'];
        this.backgroundColorOption = data['backgroundColorOption'];
        this.customField = data['customField'];
        //this.customFieldKey = data['customFieldKey'];
        this.detail = data['detail'];
        this.detailOrigin = data['detail'];

        this.select = data['select'];
        this.users = data['select'];


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
                  //self.httpDetail();
                  console.log(data);
                  self.sortByOrder(order);
                },
                e => {
                  console.log(e);
                }
              )
            }
          });
        });
        this.calculationFooter();
        this.startUpTable = true;
      },
      e => {
        console.log(e);
      }
    )
  }

  getChange(){
    console.log(this.detail);
  }

  keyword: string = '';
   
  onSearchChange() {
   
    if (!this.keyword ) {
      this.detail = this.detailOrigin;
     
    } else {
      this.detail = this.detailOrigin.filter((item: { searchable: string; }) => {
        const matchItem = item.searchable.toLowerCase().includes(this.keyword.toLowerCase());
        return matchItem;
      });
    }
    this.calculationFooter();
  }
  ngAfterViewInit() {
    console.log("ngAfterViewInit");
  }


  sortByOrder(order: any) {
    // const order = ['59', '54', '72', '23', '24', '108', '55', '19', '73', '22', '60'];

    // Buat fungsi untuk membandingkan dua elemen berdasarkan urutan 'order'
    function compareByOrder(a: DetailInterface, b: DetailInterface) {
      const aIndex = order.indexOf(a.id);
      const bIndex = order.indexOf(b.id);

      // Jika salah satu elemen tidak ada dalam 'order', letakkan di akhir
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;

      // Urutkan berdasarkan urutan dalam 'order'
      return aIndex - bIndex;
    }

    // Urutkan 'this.detail' menggunakan fungsi perbandingan
    this.detail.sort(compareByOrder);

  }


  jqueryResizable() {
    let self = this;
    if (this.resizableStatus == true) {
      this.resizableStatus = false;
      $(".resizable").resizable("destroy");
    } else {
      this.resizableStatus = true;
      $(function () {
        $(".resizable").resizable({
          maxHeight: 30,
          minHeight: 30,
          minWidth: 100,
          resize: function (event: any, ui: any) {
            let itemIndex = $(this).attr("tabindex");
            const body = {
              ui: ui.size,
              itemId: $(this).attr("id"),
              itemIndex: itemIndex,
            }

            self.customField[itemIndex]['width'] = ui.size.width;
          },
          stop: function (event: any, ui: any) {

            let itemIndex = $(this).attr("tabindex");
            const body = {
              ui: ui.size,
              itemId: $(this).attr("id"),
              itemIndex: itemIndex,
            }
            // self.customField[itemIndex]['width'] = ui.size.width;
            console.log(body);
            self.http.post<any>(environment.api + "CustomField/fieldResizable", body, {
              headers: self.configService.headers(),
            }).subscribe(
              data => {
                console.log(data);
              },
              e => {
                console.log(e);
              }
            )
          }
        });
      });
    }
  }

  calculationFooter() {
    let i = 0;
    let select : any =  [];
    console.log('calculationFooter : detailOrigin | detail ', this.detailOrigin, this.detail);
    for(let x = 0 ; x < this.select.length ; x++){
      let data = {
        fn : this.select[x].field,
        option : this.select[x].option
      }
      select.push(data);
    }
    const index = select[2].option.findIndex((el: { id: any; }) => el.id === '49');
    console.log(index);

    this.customField.forEach((el: any) => {
      let value = 0;

      this.detail.forEach((item: any) => {
        if (el['iType'] == 'number' || el['iType'] == 'formula') {
          if (item[el['key']] != "") {
            value += parseFloat(item[el['key']]);
          }
        }
        if (el['iType'] == 'select') {
          const fnIndex = select.findIndex((rec: { fn: any; }) => rec.fn === el['key'] );
          console.log('fnIndex : '+fnIndex);
          const OptIndex = select[fnIndex].option.findIndex((rec: { id: any; }) => rec.id === item[el['key']] );
          console.log('index option: '+OptIndex);
          if(OptIndex > -1){
            select[fnIndex].option[OptIndex]['total'] = parseInt(select[fnIndex].option[OptIndex]['total'])+ 1;
          }
         
        }
         
      }); 


      if (el['iType'] == 'number' || el['iType'] == 'formula') {
        this.customField[i]['total'] = new Intl.NumberFormat('en-US').format(parseFloat(value.toFixed(2)));
      }
      if (el['iType'] == 'select' ) {
        this.customField[i]['total'] = "SOON";
      }
     
      i++;
    }); 
    console.log("select calculation", select);
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
  close(){
    this.modalService.dismissAll();
  }
  onChild(newItem: any) {
    //console.log(this.detail[newItem.index]);
    // console.log("Saving...", this.waiting);
    //    console.log("return from child ", newItem);

    if (newItem['itype'] == 'note') {
      this.detailObject = newItem; 
      const offcanvasRef = this.offcanvasService.open(OffCanvasNotesComponent,{ position: 'end', panelClass: 'details-panel', });
      offcanvasRef.componentInstance.name = 'World';
  
    }
    else  if (newItem['itype'] == 'image') {
      this.detailObject = newItem; 
      const offcanvasRef = this.offcanvasService.open(OffCanvasImagesComponent,{ position: 'end', panelClass: 'details-panel', });
      offcanvasRef.componentInstance.name = 'World';
  
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
                self.httpDetail(true);
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
     
      let fx = "f" + newItem.customField.f as keyof DetailInterface; 
      console.log(fx, this.detailOrigin[newItem.index]);
 
      const body = {
        id: this.id,
        newItem: newItem,
        fx : fx,
      }
      console.log('onChild',body);
      this.http.post<any>(environment.api + 'CustomField/updateData', body,
        { headers: this.configService.headers() }
      ).subscribe(
        data => {
          
          let i = 0;  
          this.detail.forEach(() => {
          //  objIndex = this.detail[i].findIndex(((obj: { id: any; }) => obj.id == data['detail'][0].id));
        //    console.log(i,  this.detail[i]['id'] == data['detail'][0].id );
            if(  this.detail[i]['id'] == data['detail'][0].id ){
              this.detail[i] = data['detail'][0];
             // console.log(i, this.detail[i], data['detail'][0] );
            }
            if( this.detailOrigin[i]['id'] == data['detail'][0].id ){
              this.detailOrigin[i] = data['detail'][0];
            }
           i++;
          }); 
          this.calculationFooter()
        
        },
        e => {
          console.log(e);
        },
      );
 
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

    if (action == 'delete') {
      this.tools = false;
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
          this.tools = false;
          this.httpDetail();
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

  }

  reloadColumn(data: any) {
    console.log("reloadColumn Disabel", data);
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
      // this.detail.move(objIndex, 0);
      this.detail.splice(objIndex, 0);

    });

  }

  requestToken() {
    this.loading = true;
    const body = {
      journalId: this.id,
      journalTableViewId: this.journalTableViewId
    }
    this.http.post<any>(environment.api + "tables/requestToken", body, {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data);
        if (data['error'] == false && data['token'] != '') {
          console.log("masuk");
          this.loading = false;
          location.href = environment.api + 'tables/exportCSV/?t=' + data['token'];
        }
      },
      e => {
        console.log(e);
        this.loading = false;
      }
    )
  }

  /**
   * SELECT POPUP / OPEN EDIT POPUP
   */
  //httpJournalSelect() {
  //  this.httpDetail(true);
  //}

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
       // this.httpJournalSelect();
         this.httpDetail(true);
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
        //this.httpJournalSelect();
         this.httpDetail(true);
        this.newSelect.value = "";
      },
      e => {
        console.log(e);
      }
    )
  }
  /**
   * END :: SELECT POPUP / OPEN EDIT POPUP
   */


  // fnEdiable(row: number, column: number) {
  //   let i = 0;
  //   for( i = 0; i < this.cell.length; i++ ){
  //     let n = 0;
  //     for(n = 0 ; n < this.cell[0].length ; n++){
  //       this.cell[i][n] = 0;
  //     }
  //   }
  //   this.cell[row][column] = 1;

  // }

  // fnCell(row: number, column: number) {
  //   return this.cell[row][column];
  // }

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
        this.resizableStatus = false;
        if (data == 'httpDetail') {
          this.httpDetail();
        }
        else if (data == 'reload') {
          this.reload([]);
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

  evalDescription(evals: string, obj: any) {
    //console.log(obj);
    let formula = evals;

    obj.forEach((item: { key: any; name: { toString: () => string; }; }) => {
      formula = formula.replace(`$${item.key}`, item.name.toString());
    });
    return formula;
  }

}
