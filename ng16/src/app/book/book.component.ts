import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ConfigService } from 'src/app/service/config.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Chart from 'chart.js/auto';

declare var $: any;

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  newJournal: string = "";
  id: string = "";
  items: any = [];
  chart: any = [];
  permission: any = [];
  loading: boolean = false;
  item: any = [];
  journalAccess: any = [];
  addUser: string = "";
  book: any = [];
  editable :any = {
    title : false,
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private configService: ConfigService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  public onChild(obj: any) {
    console.log('obj child : ', obj);
    this.id = obj['id'];
    this.httpGet();
  }
  public updateHeader(){
    const data = {
      id : this.book.id,
      name : this.book.name,
    }
    return data;
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params["id"];
    this.httpGet();
  }


  httpGet() {
    this.editable.title = false;  
    this.http.get<any>(environment.api + "journal/index/" + this.id, {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        this.permission = data['permission'];
        this.items = data['items'];
        console.log(data);
        this.book = data['book'];
        var self = this;
        $(function () {
          $(".sortable").sortable({
            handle: ".handle",
            update: function (event: any, ui: any) {
              const order: any[] = [];
              $(".sortable .handle").each((index: number, element: any) => {
                const itemId = $(element).attr("id");
                order.push(itemId);
              });

              self.http.post<any>(environment.api + "journal/sorting", order, {
                headers: self.configService.headers(),
              }).subscribe(
                data => {
                  console.log(data);
                  // console.log(self.items)  
                },
                e => {
                  console.log(e);
                }
              )

            }
          });
        });
      },
      e => {
        console.log(e);
      }
    )
  }

  fnEditableChange(){
    if (this.book.name != "") {
      console.log(this.book);
    
      const body = {
        book: this.book, 
        id: this.id
      }
      this.http.post<any>(environment.api + "journal/fnEditableChange", body, {
        headers: this.configService.headers()
      }).subscribe(
        data => { 
          console.log(data);
          this.editable.title = false;  
        },
        e => {
          console.log(e);
        }
      )
    }
    
  }

  onCreateNew() {
    if (this.newJournal != "") {


      const body = {
        insert: true,
        name: this.newJournal,
        id: this.id
      }
      this.http.post<any>(environment.api + "journal/onCreateNew", body, {
        headers: this.configService.headers()
      }).subscribe(
        data => {
          console.log(data);
          this.newJournal = "";
          //   this.items = data['items'];
          this.httpGet();
        },
        e => {
          console.log(e);
        }
      )
    }
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

        this.httpGet();
      },
      e => {
        console.log(e);
      }
    )
  }

  open(content: any, x: any) {
    this.item = x;
    this.http.get<any>(environment.api + "journal/access?journalId=" + x.id, {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data);
        this.journalAccess = data['journal_access'];
        this.modalService.open(content, { size: 'md' });

      },
      e => {
        console.log(e);
      }
    )

  }

  fnClearTrashBin() {
    const body = {
      remove: true,
    }
    this.http.post<any>(environment.api + "journal/fnClearTrashBin", body, {
      headers: this.configService.headers()
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

  fnDeleteAll() {
    if (confirm("Delete all check list ?")) {
      const body = {
        items: this.items,
      }
      this.http.post<any>(environment.api + "journal/fnDeleteAll", body, {
        headers: this.configService.headers()
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
  }

  itemSetting(x: any) {
    let isDelete = false;
    if (x.presence == '1' && x.admin == '1') {
      isDelete = true;
    }
    return isDelete;
  }

  onSubmitUser() {
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

}
