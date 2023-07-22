import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ConfigService } from 'src/app/service/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;

export class NewCustomField {
  constructor(
    public name: string,
    public iType: string,
  ) { }
}

@Component({
  selector: 'app-custom-field-form',
  templateUrl: './custom-field-form.component.html',
  styleUrls: ['./custom-field-form.component.css']
})
export class CustomFieldFormComponent implements OnInit {
  @Input() customFieldForm: any;
  @Input() id: any;
  @Output() newItemEvent = new EventEmitter<string>();
  
  newCustomField = new NewCustomField("", "text");

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    console.log(this.customFieldForm);
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
              //  self.httpCustomField();
              self.emitToParent('httpCustomField');
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
              // self.httpGet();
              self.emitToParent('httpGet');
            },
            e => {
              console.log(e);
            }
          )
        }
      });
    });
  }
  addCustomField() {
    const body = {
      id: this.id,
      item: this.newCustomField
    }
    console.log(body);
    this.http.post<any>(environment.api + 'CustomField/addCustomField', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        this.newCustomField = new NewCustomField("", "text");
        console.log(data);
        if (data['error'] === true) {
          alert(data['note']);
        } 
        this.customFieldForm = data['items'];
        this.emitToParent('httpGet');
      },
      e => {
        console.log(e);
      },
    );
  }

  onUpdateCustomField(x: any) {
    console.log(x);
    this.http.post<any>(environment.api + "CustomField/onUpdateCustomField", x, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        // this.httpCustomField();
        this.emitToParent('httpCustomField');
      },
      e => {
        console.log(e);
      }
    )
  }

  removeCustomeFlied(x: any) {
    const body = {
      id: x.id,
    }
    console.log(body);
    if (confirm("Are sure delete this field?")) { 

      this.http.post<any>(environment.api + 'CustomField/removeCustomeFlied', body,
        { headers: this.configService.headers() }
      ).subscribe(
        data => {
          console.log(data);
          let objIndex = this.customFieldForm.findIndex(((obj: { id: any; }) => obj.id == x.id));
          this.customFieldForm.splice(objIndex, 1);
          // this.httpGet();
          this.emitToParent('httpGet');
        },
        e => {
          console.log(e);
        },
      );
    }
  }

  onUpdateCustomFieldAlign(x: any) {
    // this.httpGet(); 
    //  this.httpCustomField();
  }

  dismiss() {
    this.modalService.dismissAll();
  }

  emitToParent(newValue: string) { 
    this.newItemEvent.emit(newValue);
  }
}
