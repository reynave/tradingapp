import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
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
  // @Input() customFieldForm: any;
  @Input() id: any;
  @Input() journalTableViewId: any;
  @Input() note: any;
  
  @Output() newItemEvent = new EventEmitter<string>();
  customFieldForm: any = [];
  newCustomField = new NewCustomField("", "text");

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    console.log(this.id);
    this.httpGet();
  }
  httpGet() {

    this.http.get<any>(environment.api + "CustomField/index", {
      headers: this.configService.headers(),
      params: {
        id: this.id,
      }
    }).subscribe(
      data => {
        console.log('CustomField/index ',data);
        
        this.customFieldForm = data['items'];
        let self = this;
        $(function () {
 
         // $( ".selector" ).sortable( "destroy" );
          $(".journalCustomFieldSorting").sortable({
            handle: ".handle",
            placeholder: "ui-state-highlight",
            update: function (event: any, ui: any) {
              const order: any[] = [];
              $(".journalCustomFieldSorting .handle").each((index: number, element: any) => {
                const itemId = $(element).attr("id");
                order.push(itemId);
              });

              console.log('order', order);
              self.http.post<any>(environment.api + "CustomField/sortable", order, {
                headers: self.configService.headers(),
              }).subscribe(
                data => {
                  console.log('CustomField/sortable',data);
                  // self.httpGet();
                 self.emitToParent('reload');
                 console.log("self.emitToParent('reload')")
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
        $( ".selector" ).sortable( "destroy" );
        this.httpGet();
        this.emitToParent('httpDetail');
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

  removeCustomeField(x: any) {
    const body = {
      id: x.id,
    }
    console.log(body);
    if (confirm("Are sure delete this field?")) {

      this.http.post<any>(environment.api + 'CustomField/removeCustomeField', body,
        { headers: this.configService.headers() }
      ).subscribe(
        data => {
          console.log(data);
          let objIndex = this.customFieldForm.findIndex(((obj: { id: any; }) => obj.id == x.id));
          this.customFieldForm.splice(objIndex, 1);
          // this.httpGet();
          this.emitToParent('reload');
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

  fnShowFormulaDev(x: any, i: number) {
    console.log(x, i);
    if (x.showEvalDev == '' || !x.showEvalDev) {
      this.customFieldForm[i]['showEvalDev'] = true;
    }
    else if (x.showEvalDev == true) {
      this.customFieldForm[i]['showEvalDev'] = false;
    }
  }

  evalDevCheck(field: any, index: number) {
    const body = {
      field: field,
      id: this.id,
      journalTableViewId: this.journalTableViewId,
    }
    this.http.post<any>(environment.api + 'CustomField/evalDevCheck', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data);
        this.updateEval(field, index);
        this.customFieldForm[index].showEvalDev = false;
      },
      e => {
        console.log(e);
        alert("your formula is not valid!");
      },
    );

  }

  updateEval(field: any, index: number) {
    console.log(field);
    const body = {
      field: field
    }
    this.http.post<any>(environment.api + 'CustomField/updateEval', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data);
        this.customFieldForm[index]['eval'] = field['evalDev'];
        this.emitToParent('httpDetail');
      },
      e => {
        console.log(e);
        alert("your formula is not valid!");
      },
    );

  }

}
