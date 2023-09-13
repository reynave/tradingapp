import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from 'src/app/service/config.service';
import { environment } from 'src/environments/environment';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-custom-field',
  templateUrl: './custom-field.component.html',
  styleUrls: ['./custom-field.component.css'],
})
export class CustomFieldComponent implements OnInit {
  @Input() item: any = [];
  @Output() dateSelect = new EventEmitter<NgbDateStruct>();
  // @Input() itemSelect :any = [];
  @Output() newItemEvent = new EventEmitter<string>();
  copyClipboard: boolean = false;
  env: any = environment;
  childItem: any;
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) { }


  ngOnInit(): void {
    this.childItem = { ...this.item };
  }

  fnChildItemSelectOption(id: string) {
    let data = "Select ";

    let objIndex = this.childItem.select.option.findIndex(((obj: { id: string; }) => obj.id == id));
    if (objIndex > -1) {
      data = this.childItem.select.option[objIndex]['value'];
    }
    else {
      if (id !== "") {
        let objIndexHistory = this.childItem.select.optionDelete.findIndex(((obj: { id: string; }) => obj.id == id))

        if (objIndexHistory > -1) {
          data = this.childItem.select.optionDelete[objIndexHistory]['value'] + '<small class="text-danger"><i class="bi bi-exclamation-lg"></i><small>';
          //   data = objIndexHistory;
        }

      }

    }
    return data;
  }

  fnChildItemSelectOptionUser(accountId: string) {
    let data = "";
    let pic = "";
    let value = "";
    // console.log(this.childItem.select.users);
    let objIndex = this.childItem.select.users.findIndex(((obj: { accountId: string; }) => obj.accountId == accountId));
    if (objIndex > -1) {
      pic = this.childItem.select.users[objIndex]['picture'];
      value = this.childItem.select.users[objIndex]['value'];
      data = '<img src="' + pic + '" class="rounded-circle border me-1" height="25" alt="' + value + '" title="' + value + '">';
    }
    else {
      if (accountId !== "") {
        let objIndexHistory = this.childItem.select.usersDelete.findIndex(((obj: { accountId: string; }) => obj.accountId == accountId))

        if (objIndexHistory > -1) {
          data = this.childItem.select.usersDelete[objIndexHistory]['value'] + '<small class="text-danger"><i class="bi bi-exclamation-lg"></i><small>';
          //   data = objIndexHistory;
        }
      } else {
        data = '<img src="./assets/icon/user-50.png" height="25">';
      }

    }
    return data;
  }

  emitToParent(newValue: string) {
    //    console.log('emitToParent',this.childItem);
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
        this.emitToParent(this.childItem);
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


  isNumber(str: string) {
    return str.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }


  copyInputMessage(inputElement: any) {
    inputElement.select();
    this.copyClipboard = true;
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);

    setTimeout(() => {
      this.copyClipboard = false;
    }, 10000);
  }
  formatHour(variable: any){
    
  }
  formatDate(variable: any) {
    if (typeof variable === 'string') {
      var dateParts = variable.split('-');
      var year = dateParts[0];
      var month = dateParts[1];
      var day = dateParts[2];

      // Memastikan bulan memiliki dua digit
      if (month.length === 1) {
        month = '0' + month;
      }
      if (day.length === 1) {
        day = '0' + day;
      }


      // Menggabungkan kembali tahun, bulan, dan hari dalam format yang diinginkan
      var formattedDate = year + '-' + month + '-' + day;
      return formattedDate; 
    } else if (Array.isArray(variable)) {
      return 'Array';
    } else {
      return 'Not String or Array';
    }
  }



  dateFormat(val: any) {
    console.log(val);
    return val;
  }

  log($e: any) {
    console.log($e);
  }
}
