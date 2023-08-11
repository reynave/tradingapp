import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from 'src/app/service/config.service';
import { environment } from 'src/environments/environment';
import { JsonPipe } from '@angular/common';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';


// const teams: { name: string; picture: string }[] = [
// 	{ name: 'Alabama', picture: '5/5c/picture_of_Alabama.svg/45px-picture_of_Alabama.svg.png' },
// 	{ name: 'Alaska', picture: 'e/e6/picture_of_Alaska.svg/43px-picture_of_Alaska.svg.png' },
// 	{ name: 'Arizona', picture: '9/9d/picture_of_Arizona.svg/45px-picture_of_Arizona.svg.png' },
// 	{ name: 'Arkansas', picture: '9/9d/picture_of_Arkansas.svg/45px-picture_of_Arkansas.svg.png' },
// 	{ name: 'California', picture: '0/01/picture_of_California.svg/45px-picture_of_California.svg.png' },
// 	{ name: 'Colorado', picture: '4/46/picture_of_Colorado.svg/45px-picture_of_Colorado.svg.png' },
// 	{ name: 'Connecticut', picture: '9/96/picture_of_Connecticut.svg/39px-picture_of_Connecticut.svg.png' },
// 	{ name: 'Delaware', picture: 'c/c6/picture_of_Delaware.svg/45px-picture_of_Delaware.svg.png' }, 
// ];



@Component({
  selector: 'app-share-board',
  templateUrl: './share-board.component.html',
  styleUrls: ['./share-board.component.css']
})
export class ShareBoardComponent implements OnInit {
  @Input() item: any = [];
  @Input() permission: any = [];

  @Output() newItemEvent = new EventEmitter<string>();
  journalAccess: any = [];
  env: any = environment;
  addUser: string = "";
  note: string = "";
  cb2note: string = "";
  model: any;

  teams: any[] = [];


  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    //this.childItem = { ...this.item }; 
    console.log(this.item, this.permission);

    this.http.get<any>(environment.api + "journal/access", {
      headers: this.configService.headers(),
      params: {
        journalId: this.item.id,
      }
    }).subscribe(
      data => {
        console.log(data);
        this.journalAccess = data['journal_access'];
        this.teams = data['teams'];
      },
      e => {
        console.log(e);
      }
    )
  }

  close() {
    this.modalService.dismissAll();
  }

  onUpdatePermission(x: any) {
    console.log(x, this.item);
    const body = {
      permission: x,
      item: this.item,
    }
    this.item.permissionId = x.id;
    this.http.post<any>(environment.api + "journal/onUpdatePermission", body, {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data);
        this.item['fontIcon'] = x.fontIcon;
        this.item['permission'] = x.name;

        this.newItemEvent.emit(this.journalAccess);
      },
      e => {
        console.log(e);
      }
    )
  }

  onRemoveAccess(x: any) {
    const body = {
      access: x,
      item: this.item,
    }
    this.http.post<any>(environment.api + "journal/onRemoveAccess", body, {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data);
        this.journalAccess = data['journal_access'];
      },
      e => {
        console.log(e);
      }
    )
  }

  onSubmitUserDELETE() {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!this.addUser.match(mailformat)) {
      alert("Valid email address!");
    } else {
      const body = {
        addUser: this.addUser,
        item: this.item,
      }
      this.http.post<any>(environment.api + "journal/onSubmitUser", body, {
        headers: this.configService.headers()
      }).subscribe(
        data => {
          console.log(data);
          this.journalAccess = data['journal_access'];
          if (data['duplicate'] == true) {
            alert("Email already join.");
          }
          if (data['avaiable'] == true) {
            this.addUser = "";
          }
          this.note = data['note'];
        },
        e => {
          console.log(e);
        }
      )
    }
  }
  onSubmitUser() {
    this.addUser = this.model;

    const body = {
      addUser: this.addUser,
      item: this.item,
    }
    console.log(body, this.model['id']);
    if (this.model['id'] != undefined) {
      console.log("MAUSK"); 
      this.http.post<any>(environment.api + "journal/onSubmitUser", body, {
        headers: this.configService.headers()
      }).subscribe(
        data => {
          console.log(data);
          this.journalAccess = data['journal_access'];
          if (data['duplicate'] == true) {
            alert("Account already join.");
          }
          if (data['avaiable'] == true) {
            this.addUser = "";
          }
          this.note = data['note'];
        },
        e => {
          console.log(e);
        }
      ) 
    }
  }

  fnCb2() {
    this.cb2note = "Copy to clipboard";
    setTimeout(() => {
      this.cb2note = "";
    }, 3000);
  }

  search: OperatorFunction<string, readonly { name: any; picture: any }[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term === ''
          ? []
          : this.teams.filter((v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),

      ),
    );

  formatter = (x: { name: string }) => x.name;

}
