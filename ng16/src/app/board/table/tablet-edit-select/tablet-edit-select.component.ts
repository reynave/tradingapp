import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from 'src/app/service/config.service';
import { BackgroundColorOption } from 'src/app/board/table/table-interface';
import { environment } from 'src/environments/environment';
import { SocketService } from 'src/app/service/socket.service';
declare var $: any;
export class NewSelect {
  constructor(
    public value: string,
    public field: string,
    public journalId: string,
    public color: string,
  ) { }
}
@Component({
  selector: 'app-tablet-edit-select',
  templateUrl: './tablet-edit-select.component.html',
  styleUrls: ['./tablet-edit-select.component.css']
})
export class TabletEditSelectComponent implements OnInit {
  @Input() journalId: string = "";
  @Input() field: string = "";
  newSelect = new NewSelect("", "", "", "#279EFF");
  backgroundColorOption: BackgroundColorOption[] = [];
  journal_select: any = [];

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private modalService: NgbModal,
    private socketService : SocketService,
  ) { }

  ngOnInit(): void {
    this.newSelect['field'] = this.field;
    this.newSelect['journalId'] = this.journalId;
    this.httpGet();
    console.log('ngOnInit ', this.field, this.journalId);
  }

  httpGet() {
    this.http.get<any>(environment.api + "JournalSelect/index", {
      headers: this.configService.headers(),
      params: {
        field: this.field,
        journalId: this.journalId,
      }
    }).subscribe(
      data => {
        console.log(data);
        this.backgroundColorOption = data['color'];
        this.journal_select = data['journal_select'];
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
                journalId: self.journalId,
              }
              self.http.post<any>(environment.api + "CustomField/updateSortableSelect", body, {
                headers: self.configService.headers(),
              }).subscribe(
                data => {
                },
                e => {
                  console.log(e);
                }
              )
            }
          });
        });
      },
      error => {
        console.log(error);
      }
    )
  }

  close() {
    this.modalService.dismissAll();
  }

  onUpdateSelect(data: any) {
    console.log(data);
    this.http.post<any>(environment.api + "CustomField/updateSelect", data, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.httpDetail();
      },
      e => {
        console.log(e);
      }
    )
  }

  httpDetail(){
    const msg = {
      action : 'httpDetail',
      journalId : this.journalId,
      address : localStorage.getItem("address.mirrel.com"),
      chat : this.configService.account()['account']['name']+' Update Select Option',
    }

    this.socketService.sendMessage(msg);
  }

  onDeleteSelect(data: any) {
    console.log(data);
    
    this.http.post<any>(environment.api + "CustomField/deleteSelect", data, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        const index = this.journal_select.findIndex((item: { id: string; }) => item.id === data['id']); 
        this.journal_select.splice(index, 1);
        this.httpDetail(); // CALL PARENT
      },
      e => {
        console.log(e);
      }
    )
  }

  addInsertSelect() {
    if (this.newSelect.value != "") {
      this.http.post<any>(environment.api + "CustomField/insertSelect", this.newSelect, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          this.journal_select = data['option'];
          this.httpDetail(); 
          this.newSelect.value = "";
        },
        e => {
          console.log(e);
        }
      )
    }

  }
}
