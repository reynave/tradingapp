import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from 'src/app/service/config.service';
import { environment } from 'src/environments/environment';
import { JsonPipe } from '@angular/common';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from 'src/app/service/socket.service';
 

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
  loading: boolean = true;
  searchPhotos: string = "";
  photos: any = [];
  photosTotal: number = 0;
  invitedLink : string = "";
  showSearchPhoto: boolean = false; 
  pendingUser : any = [];
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private modalService: NgbModal, 
    private socketService: SocketService,
    private activeRouter : ActivatedRoute,
  ) { }

  ngOnInit() {  
    console.log(this.item, this.permission,);
    this.unsplash(); 
    this.fnInvetedLink();
    this.httpJournalAccess(); 
    this.httpInviteJournal(); 
  }

  httpJournalAccess(){
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
  httpInviteJournal(){
    this.http.get<any>(environment.api + "invited/journal", {
      headers: this.configService.headers(),
      params: {
        journalId: this.item.id,
      }
    }).subscribe(
      data => {
        this.pendingUser = data['items'];
        console.log('httpInviteJournal',data); 
      },
      e => {
        console.log(e);
      }
    )
  }

  fnInvetedLink(){
    this.http.get<any>(environment.api + "journal/fnInvetedLink", {
      headers: this.configService.headers(),
      params: {
        journalId: this.item.id,
      }
    }).subscribe(
      data => {
        console.log(data); 
        this.invitedLink = data['invitedLink'];
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
        const msg = {
          action: 'journal/onUpdatePermission',
          journalId : this.activeRouter.snapshot.queryParams['id'],
        }
        this.socketService.sendMessage(msg);
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
        const msg = {
          action: 'tableHttpUsers',
          journalId : this.activeRouter.snapshot.queryParams['id'],
        }
        this.socketService.sendMessage(msg);
      },
      e => {
        console.log(e);
      }
    )
  }

 

  onSubmitUser() {
    this.addUser = this.model;

    const body = {
      addUser: this.addUser,
      item: this.item,
    }
    console.log("onSubmitUser : ",body);
    if (this.model['id'] != undefined) { 
      this.http.post<any>(environment.api + "journal/onSubmitUser", body, {
        headers: this.configService.headers()
      }).subscribe(
        data => {
          this.model = "";
          this.journalAccess = data['journal_access'];  
          if (data['error'] == false) {
            this.addUser = ""; 
            const msg = {
              action: 'tableHttpUsers',
              journalId : this.activeRouter.snapshot.queryParams['id'],
            }
            this.socketService.sendMessage(msg);
          }
          this.note = data['note'];
        },
        e => {
          console.log(e);
        }
      )
    }else{
      this.note = this.addUser+ ' is not yet registered in your team list, please invite them to join you!';
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

  page: number = 1;
  unsplash() {
    this.loading = true;
    this.photos = [];
    //http://localhost/app/tradingapp/public/Unsplash?p=1
    this.http.get<any>(environment.api + "Unsplash", {
      headers: this.configService.headers(),
      params: {
        p: this.page,
        searchPhotos: this.searchPhotos,
      }
    }).subscribe(
      data => {
        this.loading = false;
        console.log(data);
        this.photos = data['photos']['results'];
        this.photosTotal = data['photos']['total'];

      },
      error => {
        console.log(error);
      }
    )
  }

  fnPrev() {
    this.page -= 1;
    this.unsplash();  
  }

  fnNext() {
    this.page += 1;
    this.unsplash(); 
  }

  updatePhoto(url  : string){
    this.item.image = url;
    this.showSearchPhoto = false;

    const body = { 
      image: url,
      id : this.item.id,
    }
    
    this.http.post<any>(environment.api + "journal/updatePhoto", body, {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data); 
      },
      e => {
        console.log(e);
      }
    )
  }

  email : string = "";
  fnInvited(){
    const body = { 
      email: this.email,
      journal_id : this.item.id,
    }
    
    this.http.post<any>(environment.api + "invited/fnInvited", body, {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data); 
        this.email = "";
        this.httpInviteJournal(); 
      },
      e => {
        console.log(e);
      }
    )
  }
}
