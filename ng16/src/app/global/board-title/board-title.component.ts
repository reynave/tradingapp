import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/service/config.service';
import { FunctionsService } from 'src/app/service/functions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ShareBoardComponent } from 'src/app/template/share-board/share-board.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from 'src/app/service/socket.service';

export class Model {
  constructor(
    public name: string,
    public permissionId: number,
    public url: string,
    public borderColor: string,
    public backgroundColor: string,

  ) { }
}

@Component({
  selector: 'app-board-title',
  templateUrl: './board-title.component.html',
  styleUrls: ['./board-title.component.css']
})
export class BoardTitleComponent implements OnInit {

  items: any = [];
  journal: any = [];
  item = new Model("", 0, "", "", "");
  id: string = "";
  journalTableViewId: string = "";
  waiting: boolean = false;
  loading: boolean = false;
  permission: any = [];
  backgroundColorOption: any = [];
  private _docSub: any;
  constructor(
    private titleService: Title,
    private http: HttpClient,
    public functionsService: FunctionsService,
    private configService: ConfigService,
    private ativatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    this.id = this.ativatedRoute.snapshot.params['id'];
    this.journalTableViewId = this.ativatedRoute.snapshot.params['journalTableViewId'];

    this.httpHeader();
    this._docSub = this.socketService.getMessage().subscribe(
      (data: { [x: string]: any; }) => {
     //   console.log(data);

        if (data['action'] === 'journalTitle') {
          this.httpHeader();
        }

      }
    );
  }

  httpHeader() {
    this.loading = true;
    this.http.get<any>(environment.api + "Tables/boardTitle", {
      headers: this.configService.headers(),
      params: {
        id: this.id
      }
    }).subscribe(
      data => {
        this.journal = data['item'];
        this.titleService.setTitle(data['item']['name']);
        this.item.name = data['item']['name'];
        this.item.permissionId = data['item']['permissionId'];
        this.permission = data['permission'];
        this.item.borderColor = data['item']['borderColor'];
        this.item.backgroundColor = data['item']['backgroundColor'];
        this.item.url = environment.api + '?share=' + data['item']['url'];
        this.loading = false;
      },
      e => {
        console.log(e);
      }
    )
  }

  onSubmit() {

    this.loading = true;
    const body = {
      id: this.id,
      item: this.item,
    }
    console.log(body);
    this.http.post<any>(environment.api + 'Tables/onSubmit', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log("onSubmit Done");

        const msg = {
          action: 'journalTitle',
        }
        this.socketService.sendMessage(msg);
      },
      e => {
        console.log(e);
      },
    );
  }

  fnPermission(id: number) {
    let data = [];
    if (this.permission.length > 0) {
      let objIndex = this.permission.findIndex(((obj: { id: number; }) => obj.id == id));
      this.permission[objIndex]['name'];
      data = this.permission[objIndex];
    }
    return data;
  }

  public onChild(obj: any) {
    console.log('obj child : ', obj);
  }

  openComponent(componentName: string, item: any) {
    if (componentName == 'ShareBoardComponent') {
      const modalRef = this.modalService.open(ShareBoardComponent, { size: 'lg' });
      modalRef.componentInstance.item = this.journal;
      modalRef.componentInstance.permission = this.permission;

      modalRef.componentInstance.newItemEvent.subscribe((data: any) => {
        console.log(data);
        //  this.httpHeader();
        const msg = {
          action: 'journalTitle',
        }
        this.socketService.sendMessage(msg);
      });
    }
  }



}
