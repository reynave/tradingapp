import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, HostListener, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/service/config.service';
import { FunctionsService } from 'src/app/service/functions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbOffcanvas, NgbModal, NgbModalConfig, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CustomFieldFormComponent } from 'src/app/template/custom-field-form/custom-field-form.component';
import { DetailInterface, FilterSelect } from './table-interface';
import { OffCanvasNotesComponent } from './off-canvas-notes/off-canvas-notes.component'; 
import { SocketService } from 'src/app/service/socket.service';
import { TabletEditSelectComponent } from './tablet-edit-select/tablet-edit-select.component';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ModalUploadDataComponent } from './modal-upload-data/modal-upload-data.component';
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
  @ViewChild('canvasImages') canvasImages: any; 
  @ViewChild('viewport') viewportRef!: ElementRef;
  @ViewChild(CdkVirtualScrollViewport, { static: false }) viewPort: CdkVirtualScrollViewport | undefined;
  allowEsc : boolean = true;
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    if(this.allowEsc == true){

      this.modalService.dismissAll();
    }
  }

 
  prod = environment.production;
  scrollX = 0;
  fields: any = [];

  newCustomField = new NewCustomField("", "text");
  id: string = "";
  journalTableViewId: string = "";

  waiting: boolean = false;
  loading: boolean = false;
  detail: any[] = [];
  detailOrigin: DetailInterface[] = [];
  myTimeout: any;
  select: any = [];
  httpNote: string = "";
  fileName = "";
  deleteAll: boolean = false;
  customField: any = [];
  customFieldForm: any = [];
  template : string = "";
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
  keyword: string = '';
  customFieldKey: any = [];
  users: any = [];
  usersHistory : any = [];
  journalAccess: any = [];
  api: string = environment.api;
  images: any = [];
  imagesLoading: boolean = false;
  imagesIndex: number = 0;
  imageQueryParams: any = []; 
  filterSelect : FilterSelect[] = [];
  private _docSub: any;
  constructor(
    private http: HttpClient,
    public functionsService: FunctionsService,
    private configService: ConfigService,
    private modalService: NgbModal,
    private ativatedRoute: ActivatedRoute,
    private offcanvasService: NgbOffcanvas,
    private socketService: SocketService,
    private router: Router,
    config: NgbModalConfig
  ) { 
    document.addEventListener('paste', this.handlePaste.bind(this));
  }

  ngOnInit(): void {

    this.id = this.ativatedRoute.snapshot.params['id'];
    this.journalTableViewId = this.ativatedRoute.snapshot.params['journalTableViewId'];
    this.httpHeader();
    this.httpDetail(true);
    this._docSub = this.socketService.getMessage().subscribe(
      (data: { [x: string]: any; }) => {
        console.log(data);
        if (data['journalId'] == this.id) {
          if (data['action'] === 'TableDetailUpdateRow') {

            const index = this.detail.findIndex((rec: { id: string; }) => rec.id === data['msg']['id']);
            if (index !== -1) {
              for (let i = 0; i < 40; i++) {
                // console.log("f"+i, this.detail[index]['f'+i]);
                if (this.detail[index]['f' + i] !== undefined) {
                  this.detail[index]['f' + i] = data['msg']['f' + i];
                } 
              } 
              ///    this.detail = this.detail.filter((x) => x != this.detail[index]);
            }
            console.log(data['msg']);  
            this.calculationFooter(); 
            //  this.httpDetail();
          }

          if (data['action'] === 'delete' || data['action'] == 'archives') {
            data['msg'].forEach((el: { [x: string]: string; }) => {
              var objIndex = this.detail.findIndex(((obj: { id: string; }) => obj.id == el['id']));
              // this.detail.splice(objIndex, 1);   
              this.detail = this.detail.filter((x) => x != this.detail[objIndex]);
              if (data['action'] == 'archives') {
                this.archives++;
              }
            });
            this.calculationFooter()
          }

          if (data['action'] === 'duplicate') {
            this.httpDetail();
          }

          if (data['action'] == 'lock') {
            data['msg'].forEach((el: { [x: string]: any; }) => {
              var objIndex = this.detail.findIndex(((obj: { id: any; }) => obj.id == el['id']));
              this.detail[objIndex]['ilock'] = "1";
            });
          }

          if (data['action'] == 'unlock') {
            data['msg'].forEach((el: { [x: string]: any; }) => {
              var objIndex = this.detail.findIndex(((obj: { id: any; }) => obj.id == el['id']));
              this.detail[objIndex]['ilock'] = "0";
            });
          }

          if (data['action'] == 'sortableDetail') {
            this.sortByOrder(data['msg']);
          }

          if (data['action'] == 'jqueryResizable') {
            let itemIndex = data['msg']['itemIndex']
            this.customField[itemIndex]['width'] = data['msg']['width'];
          }

          if (data['action'] == 'httpCustomField') {
            this.httpCustomField();
          }

          if (data['action'] == 'tableDetailFnHide') {
            let index = data['index'];
            let n = data['n'];
            console.log('tableDetailFnHide', n, index);
            if (this.journalTableViewId == data['journalTableViewId']) {
              this.customField[index]['hide'] = n == 1 ? 0 : 1;
            }

          }

          if (data['action'] == 'reload') {
            this.reload([]);
          }

          if (data['action'] == 'httpDetail') {
            this.httpDetail();
          }

          if (data['action'] == 'tableReloadAddRow') {
            console.log("add arrow", data['data']);
            this.detail = [...this.detail, data['data']];
          }

          if (data['action'] == 'tableHttpUsers') {
            this.httpUsers()
          }
          
        }
        console.log(this.detail);

      }
    );
  }

  public get inverseOfTranslation(): string {
 
    if (!this.viewPort || !this.viewPort["_renderedContentOffset"]) {
     
      return "-0px";
    }
    let offset = this.viewPort["_renderedContentOffset"]; 
    return `-${offset}px`;
  }

  public get inverseOfTranslationBottom(): string {
    if (!this.viewPort || !this.viewPort["_renderedContentOffset"]) {
      return "-0px";
    }
    let offset = this.viewPort["_renderedContentOffset"];

    return `${offset}px`;
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
    document.removeEventListener('paste', this.handlePaste);

  }

  reload(newItem: any) {
    this.id = this.ativatedRoute.snapshot.params['id'];
    this.journalTableViewId = this.ativatedRoute.snapshot.params['journalTableViewId'];
    // this.startUpTable = false;
    if (newItem['id']) {
      this.journalTableViewId = newItem['id'];
    }
    // const msg = {
    //   sender: localStorage.getItem("address.mirrel.com"), 
    //   action: "RELOAD",
    // }
    // this.socketService.sendMessage(msg);
    this.httpHeader();
    this.httpDetail();
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
        this.template = data['template'];
      },
      e => {
        console.log(e);
      }
    )
  }

  httpDetail(startUpTable: boolean = false) {
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
        this.filterSelect = data['filterSelect'];
        this.select = data['select'];
        this.users = data['users'];
        this.usersHistory= data['usersHistory'];
 
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
              //   console.log(order);
              const body = {
                order: order,
                journalId: self.id,
              }

              self.http.post<any>(environment.api + "Tables/sortableDetail", body, {
                headers: self.configService.headers(),
              }).subscribe(
                data => {
                  //self.sortByOrder(order);
                  const msg = {
                    sender: localStorage.getItem("address.mirrel.com"),
                    msg: order,
                    action: 'sortableDetail',
                    journalId: self.id,
                  }
                  self.socketService.sendMessage(msg);

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
        alert(e.error.message);
        this.allowEsc = false;
        this.openComponent("CustomFieldFormComponent","Warning : "+e.error.message);
      }
    )
  }

  httpUsers(){
    this.http.get<any>(environment.api + "Tables/users", {
      headers: this.configService.headers(),
      params: {
        id: this.id, 
      }
    }).subscribe(
      data => {
        console.log('httpUsers', data); 
        this.users = data['users'];
        this.usersHistory= data['usersHistory']; 
      },
      e => {
        console.log(e);
      }
    )
  }

  getChange() {
    console.log(this.detail);
  }
 
  onSearchChange() {
    if (!this.keyword) {
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

    this.detail = [...this.detail.sort(compareByOrder)];
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

            const msg = {
              sender: localStorage.getItem("address.mirrel.com"),
              msg: {
                width: ui.size.width,
                itemId: $(this).attr("id"),
                itemIndex: itemIndex,
              },
              action: 'jqueryResizable',
              journalId: self.id,
            }
            self.socketService.sendMessage(msg);


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
    let select: any = [];

    this.customField.forEach((el: any) => {
      let value = 0;

      this.detail.forEach((item: any) => {
        if (el['iType'] == 'number' || el['iType'] == 'formula') {
          if (item[el['key']] != "") {
            value += parseFloat(item[el['key']]);
          }
        }
        if (el['iType'] == 'select') {
          // const fnIndex = select.findIndex((rec: { fn: any; }) => rec.fn === el['key'] ); 
          // const OptIndex = select[fnIndex].option.findIndex((rec: { id: any; }) => rec.id === item[el['key']] );
          // if(OptIndex > -1){
          //   select[fnIndex].option[OptIndex]['total'] = parseInt(select[fnIndex].option[OptIndex]['total'])+ 1;
          // } 
        } 
      });


      if (el['iType'] == 'number' || el['iType'] == 'formula') {
        value = value / this.customField.length;

        this.customField[i]['total'] = new Intl.NumberFormat('en-US').format(parseFloat(value.toFixed(2)))+" <code>AVG</code> ";
      }
      if (el['iType'] == 'select') {
        this.customField[i]['total'] = "SOON";
      }
      i++;
    });
    // console.log("calculation DONE");
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

  close() {
    this.modalService.dismissAll();
  }


  onChild(newItem: any) {

    if (newItem['itype'] == 'note') {
      this.detailObject = newItem;
      const offcanvasRef = this.offcanvasService.open(OffCanvasNotesComponent, { position: 'end', panelClass: 'details-panel', });
      offcanvasRef.componentInstance.name = 'World';

    }

    else if (newItem['itype'] == 'image') {
      this.clipboardImage = "";
      this.url = "";
      this.detailObject = newItem;
      this.imagesLoading = true;
      this.imagesIndex = newItem['index'] + 1;
      this.imageQueryParams = {
        id: this.detailObject.id,
        fn: this.detailObject.customField.f,
      }
      this.router.navigate([], {
        queryParams: this.imageQueryParams,
        queryParamsHandling: 'merge',
      })

      console.log(newItem);
      this.offcanvasService.open(this.canvasImages, { position: 'end' }).result.then(
        (result) => { this.images = []; this.imageQueryParams = [] },
        (reason) => { this.images = []; this.imageQueryParams = [] },
      );
      this.httpImages();


    }
    else if (newItem['itype'] == 'editSelect') {
      this.detailObject = newItem;

      this.newSelect.field = this.detailObject.select.field;
      this.newSelect.journalId = this.detailObject.customField.journalId;

      const modalRef = this.modalService.open(TabletEditSelectComponent, { size: 'md' });
      modalRef.componentInstance.field = this.detailObject.select.field;
      modalRef.componentInstance.journalId = this.id;

    }
    else {

      let fx = "f" + newItem.customField.f as keyof DetailInterface;
      //   console.log(fx, this.detailOrigin[newItem.index]);

      const body = {
        id: this.id,
        newItem: newItem,
        fx: fx,
      }
      //   console.log('onChild', body);


      this.http.post<any>(environment.api + 'CustomField/updateData', body,
        { headers: this.configService.headers() }
      ).subscribe(
        data => {
          //  console.log("CustomField/updateData ", data);

          const msg = {
            sender: localStorage.getItem("address.mirrel.com"),
            msg: data['detail'][0],
            journalId: this.id,
            action: 'TableDetailUpdateRow',
            chat: this.configService.account()['account']['name'] + ' update column',
          }
          this.socketService.sendMessage(msg);

        },
        e => {
          console.log(e);
        },
      );

    }
  }

  updateRow(row: any, fx: string, column: any) {
    console.log(row);

    const body = {
      id: this.id,
      row: row,
      fx: fx,
      column: column,
    }
    console.log('updateRow', body);
    this.http.post<any>(environment.api + 'CustomField/updateRow', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log("CustomField/updateRow ", data);

        const msg = {
          sender: localStorage.getItem("address.mirrel.com"),
          msg: data['row'],
          journalId: this.id,
          action: 'TableDetailUpdateRow',
          chat: this.configService.account()['account']['name'] + ' update column',
        }
        this.socketService.sendMessage(msg);

      },
      e => {
        console.log(e);
      },
    );
  }

  background(id: string) {
    let objIndex = this.backgroundColorOption.findIndex(((obj: { id: string; }) => obj.id == id));
    if (objIndex > -1) {
      return this.backgroundColorOption[objIndex]['color'];
    } else {
      return 'auto';
    }
  }

  selectOption(id: string, fn: string) {
    //let data = "id : " + id + ", F : " + fn;
    var data: any = [];
    let index = this.select.findIndex(((obj: { field: string; }) => obj.field == 'f' + fn));
    if (id == '') {
      data = [];
    } else {
      if (index > -1) {
        let optionIndex = this.select[index].option.findIndex(((obj: { id: string; }) => obj.id == id));
        if (optionIndex > -1) {
          data = this.select[index].option[optionIndex];
        } else {

          let objIndexHistory = this.select[index].optionDelete.findIndex(((obj: { id: string; }) => obj.id == id))
          if (objIndexHistory > -1) {
            // let history = this.select[index].optionDelete[objIndexHistory];
            // history =  this.select[index].optionDelete[objIndexHistory]['value'] + '<small class="text-danger"><i class="bi bi-exclamation-lg"></i><small>';
            data = {
              value: '<small class="text-danger">REMOVED <i class="bi bi-exclamation-lg"></i><small> ',
              color: "none"
            };
          }
        }
      }

    }
    return data;
  }

  selectDropdown(fn: string) {
    let index = this.select.findIndex(((obj: { field: string; }) => obj.field == 'f' + fn));
    return this.select[index].option;
  }

  fnSelectDropdown(id: string, fx: string, column: any, row: any) {
    var row = row;
    row['f' + fx] = id;
    const body = {
      id: this.id,
      column: column,
      row: row,
      fx: fx, 
    }
    console.log(body);
    this.http.post<any>(environment.api + 'CustomField/updateRow', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log("fnSelectDropdown ", data);
        const msg = {
          sender: localStorage.getItem("address.mirrel.com"),
          msg: data['row'],
          journalId: this.id,
          action: 'TableDetailUpdateRow',
          chat: this.configService.account()['account']['name'] + ' update column',
        }
        this.socketService.sendMessage(msg);

      },
      e => {
        console.log(e);
      },
    );
  }

  usersDropdown(fn: string) {
    let index = this.select.findIndex(((obj: { field: string; }) => obj.field == 'f' + fn));
    return this.select[index].users;
  } 

  modalEditSelect(fx: string) {
    const modalRef = this.modalService.open(TabletEditSelectComponent, { size: 'md' });
    modalRef.componentInstance.field = 'f' + fx;
    modalRef.componentInstance.journalId = this.id;
  }

  selectUsers(accountId: string) {
    //let data = "id : " + id + ", F : " + fn;
    var data: any = [];
    let index = this.usersHistory.findIndex(((obj: { accountId: string; }) => obj.accountId == accountId));
    if ((index > -1) ) {
      data = this.usersHistory[index];
    } else { 
      data = []; 
    }
    return data;
  }


  offCanvasImages(row: any, fx: string, index: number) {
    this.clipboardImage = "";
    this.url = "";
    this.detailObject = row;
    this.imagesLoading = true;
    this.imagesIndex = index + 1;
    this.imageQueryParams = {
      id: row['id'],
      fn: fx,
      iLock: this.detail[index]['ilock'],
    }
    this.router.navigate([], {
      queryParams: this.imageQueryParams,
      queryParamsHandling: 'merge',
    })
    this.offcanvasService.open(this.canvasImages, { position: 'end' }).result.then(
      (result) => { this.images = []; this.imageQueryParams = [] },
      (reason) => { this.images = []; this.imageQueryParams = [] },
    );
    this.httpImages();
  }

  modalUploadData(){
    let ngbModalOptions: NgbModalOptions = {
      backdrop : true,
      keyboard : false,
      size : 'md',
};
    const modalRef = this.modalService.open(ModalUploadDataComponent, ngbModalOptions);
		modalRef.componentInstance.journalId = this.id;
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
        // this.reloadAddRow(data['detail'][0]);
        const msg = {
          data: data['detail'][0],
          action: 'tableReloadAddRow',
          journalId: this.id,
          chat: this.configService.account()["account"]['name'] + " add task",
        }
        this.socketService.sendMessage(msg);
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


    const msg = {
      sender: localStorage.getItem("address.mirrel.com"),
      msg: detail,
      action: action,
      journalId: this.id,
    }
    this.socketService.sendMessage(msg);

    const body = {
      detail: detail,
    }
    this.loading = true;
    if (action == 'delete') {
      this.tools = false;
      this.http.post<any>(environment.api + "Tables/deleteTask", body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          console.log(data);
          this.loading = false;
        },
        e => {
          console.log(e);
        }
      )
    }

    if (action == 'duplicate') {
      this.tools = false;
      this.http.post<any>(environment.api + "Tables/duplicateTask", body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          console.log(data);
          this.loading = false;
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
          this.loading = false;
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
          this.loading = false;
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
          this.loading = false;
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

  fnHide(n: number, index: number, item: any) {
    console.log(n, index);
    this.customField[index]['hide'] = n == 1 ? 0 : 1;


    const data = {
      action: 'tableDetailFnHide',
      item: item,
      hide: this.customField[index]['hide'],
      id: this.id,

      journalTableViewId: this.journalTableViewId,
      address: localStorage.getItem("address.mirrel.com"),  // for  socket only
      chat: this.configService.account()['account']['name'] + ' update hidden column',  // for  socket only
      index: index, // for  socket only
      n: n,  // for  socket only
      journalId: this.id,  // for  socket only
    }

    this.socketService.sendMessage(data);

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

  openComponent(componentName: string, note:string = "") {
    if (componentName == 'CustomFieldFormComponent') {
      const modalRef = this.modalService.open(CustomFieldFormComponent, { fullscreen: true });
      //    modalRef.componentInstance.customFieldForm = this.customFieldForm;
      modalRef.componentInstance.id = this.id;
      modalRef.componentInstance.journalTableViewId = this.journalTableViewId;
      modalRef.componentInstance.note = note;

      modalRef.componentInstance.newItemEvent.subscribe((data: any) => {
        console.log('CustomFieldFormComponent', data);
        this.resizableStatus = false;
        const body = {
          action: data,
          journalId: this.id,
          chat: this.configService.account()['account']['name'] + " was update header",
        }
        this.socketService.sendMessage(body);

      });
    }

    if (componentName == 'openArchived') {

    }
  }

  evalDescription(evals: string, obj: any) {
    //console.log(obj);
    let formula = evals;

    obj.forEach((item: { key: any; name: { toString: () => string; }; }) => {
      formula = formula.replace(`$${item.key}`, item.name.toString());
    });
    return formula;
  }
  isX : number = 0;
  onScroll(event: Event): void {
    const dataContainer = event.target as HTMLElement;
    const verticalScrollY = dataContainer.scrollTop; // Mendapatkan nilai Y
    const horizontalScrollX = dataContainer.scrollLeft; // Mendapatkan nilai X

    // Sekarang Anda dapat menggunakan nilai Y dan X sesuai kebutuhan
   // console.log('Scroll Y:', verticalScrollY);
   // console.log('Scroll X:', horizontalScrollX);
    this.isX = horizontalScrollX;
    //$('.isScollX').css("background-color", "#f4f4f4");
    $('.isScollX').css("left", "-"+horizontalScrollX+"px");
    
  }

  clipboardImage: string = '';
  @ViewChild('imageInput', { static: false }) imageInput: ElementRef | any;
  caption: string = "";
  url: string = "";

  closeImages() {
    if (this.clipboardImage || this.url) {
      this.clipboardImage = "";
      this.url = "";
    } else {
      this.offcanvasService.dismiss();
    }
  }

  handlePaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    console.log(event, items);

    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
              this.clipboardImage = e.target?.result as string;
              console.log('Gambar di-Paste:', this.clipboardImage);
              this.url = "";

            };

            reader.readAsDataURL(blob);
          }
        } else {
          console.log('null paste');
        }
      }
    }
  }

  onImagesPost() {
    const body = {
      clipboardImage: this.clipboardImage,
      caption: this.caption,
      journalId: this.id,
      id: this.imageQueryParams.id,
      fn: this.imageQueryParams.fn,
      url: this.url,
    }

    this.clipboardImage = "";
    this.caption = "";

    this.http.post<any>(environment.api + "Upload64/base64ToJpg", body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.httpImages();
        const msg = {
          sender: localStorage.getItem("address.mirrel.com"),
          msg: data['row'],
          journalId: this.id,
          action: 'TableDetailUpdateRow',
          chat: this.configService.account()['account']['name'] + ' add image',
        }
        this.socketService.sendMessage(msg);
      },
      error => {
        console.log(error);
      }
    )
  }

  onImagesSaveUrl() {
    const body = {
      caption: this.caption,
      id: this.imageQueryParams.id,
      fn: this.imageQueryParams.fn,
      url: this.url,
    }

    this.clipboardImage = "";
    this.caption = "";
    this.url = "";

    this.http.post<any>(environment.api + "Images/onImagesSaveUrl", body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.httpImages();
        const msg = {
          sender: localStorage.getItem("address.mirrel.com"),
          msg: data['row'],
          journalId: this.id,
          action: 'TableDetailUpdateRow',
          chat: this.configService.account()['account']['name'] + ' add url image',
        }
        this.socketService.sendMessage(msg);
      },
      error => {
        console.log(error);
      }
    )
  }

  httpImages() {
    this.http.get<any>(environment.api + "images/boardTable", {
      headers: this.configService.headers(),
      params: {
        id: this.imageQueryParams.id,
        fn: this.imageQueryParams.fn,
      }
    }).subscribe(
      data => {
        console.log(data);
        this.images = data['items'];
        this.imagesLoading = false;
      },
      error => {
        console.log(error);
      }
    );

  }

  onImagesRemove(x: any) {
    const body = {
      item: x,
    } 
    console.log('onImagesRemove',body);
    this.http.post<any>(environment.api + "images/onImagesRemove", body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.httpImages();
        const msg = {
          sender: localStorage.getItem("address.mirrel.com"),
          msg: data['row'],
          journalId: this.id,
          action: 'TableDetailUpdateRow',
          chat: this.configService.account()['account']['name'] + ' remove image',
        }
        this.socketService.sendMessage(msg);
      },
      error => {
        console.log(error);
      }
    );
  }

  // FILTER 
  updateFilter(){
    const body = {
      filterItem : this.filterSelect,
      journalTableViewId : this.journalTableViewId, 
    }
    console.log(body);
    this.http.post<any>(environment.api+"Tables/updateFilter",body,{
      headers : this.configService.headers(),
    }).subscribe(
      data=>{
        console.log(data);
      },
      error=>{
        console.log(error);
      }
    )
  }
}
