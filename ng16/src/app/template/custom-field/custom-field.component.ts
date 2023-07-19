import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from 'src/app/service/config.service';
import { environment } from 'src/environments/environment'; 

@Component({
  selector: 'app-custom-field',
  templateUrl: './custom-field.component.html',
  styleUrls: ['./custom-field.component.css']
})
export class CustomFieldComponent implements OnInit {
  @Input() item: any = [];
  @Output() dateSelect = new EventEmitter<NgbDateStruct>();
  // @Input() itemSelect :any = [];
  @Output() newItemEvent = new EventEmitter<string>();

  childItem: any;
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) { }


  ngOnInit(): void {
    this.childItem = { ...this.item };
  }

  fnChildItemSelectOption(id: string) {
    let data = "";

    let objIndex = this.childItem.select.option.findIndex(((obj: { id: string; }) => obj.id == id));
    if (objIndex > -1) {
      return this.childItem.select.option[objIndex]['value'];
    }
    else {
      if (id !== "") {
        let objIndexHistory = this.childItem.select.optionHistory.findIndex(((obj: { id: string; }) => obj.id == id))

        if (objIndexHistory > -1) {
          data = this.childItem.select.optionHistory[objIndexHistory]['value'] + '<small class="text-danger"><i class="bi bi-exclamation-lg"></i><small>';
          //   data = objIndexHistory;
        }

      }
      return data;
    }
  }

  emitToParent(newValue: string) {
    this.newItemEvent.emit(this.childItem);
  }
  emitModalEditSelect() {
    this.childItem.itype = "editSelect";
    console.log(this.childItem);
    this.newItemEvent.emit(this.childItem);
  }

  background(id: string) {
    let objIndex = this.childItem.select.option.findIndex(((obj: { id: string; }) => obj.id == id));
    if (objIndex > -1) {
      return this.childItem.select.option[objIndex]['color'];
    } else {
      return 'auto';
    }
  }

  emitSelectToParent(newValue: string) {
    console.log(newValue);
    this.childItem.value = newValue;
    this.childItem.itype = "select";
    console.log(this.childItem);
    //this.childItem.newItem.value = newValue;
    this.newItemEvent.emit(this.childItem);
  }

  openCanvas(content: any) {
    console.log(content);
  }

  updateUrl() {
    this.childItem.itype = "url";

    this.http.post<any>(environment.api + 'CustomField/updateUrl', this.childItem,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data);
        console.log("onSubmit Done");
      },
      e => {
        console.log(e);
      },
    );
  }

  onDateSelect(newDate: any) {
    console.log(newDate);
    this.emitToParent(this.childItem);
  }


  isNumber(str : string) {   
      return str.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","); 
  }
}
