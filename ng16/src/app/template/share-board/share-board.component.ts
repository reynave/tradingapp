import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from 'src/app/service/config.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    //this.childItem = { ...this.item }; 
    console.log(this.item, this.permission);

    this.http.get<any>(environment.api + "journal/access?journalId=" + this.item.id, {
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


  close() {
    this.modalService.dismissAll();
  }

  onUpdatePermission(x: any) {
    
    console.log(x, this.item);
    const body = {
      permission: x,
      item: this.item,
    }
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

  onSubmitUser(){
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
          //this.httpGet();
        },
        e => {
          console.log(e);
        }
      )
    }
  }

}
