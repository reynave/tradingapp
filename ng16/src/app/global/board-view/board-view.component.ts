import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/service/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Output, EventEmitter } from '@angular/core'; 
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.css']
})
export class BoardViewComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<string>();
  id: string = "";
  journalTableViewId: string = "";
  items: any = [];
  journalAccess : any = [];
  constructor(
    private http: HttpClient,
    private configService: ConfigService, 
    private ativatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    configDropdown: NgbDropdownConfig,
    config: NgbModalConfig,
  ) {
   // configDropdown.placement = 'bottom-end';
    config.backdrop = 'static';
		config.keyboard = false;
   }

  ngOnInit(): void {
   
    this.id = this.ativatedRoute.snapshot.params['id'];
    this.journalTableViewId = this.ativatedRoute.snapshot.params['journalTableViewId'];

    const ab : any = localStorage.getItem(this.id);
    this.items = JSON.parse(ab );
    this.httpGet();

  }
  httpGet() {
    this.http.get<any>(environment.api + "Board/view", {
      headers: this.configService.headers(),
      params: {
        id: this.id,
        journalTableViewId: this.journalTableViewId
      }
    }).subscribe(
      data => {
        console.log('boardView-httpGet',data);
        this.items = data['items'];
        this.journalAccess = data['journal_access'];
        localStorage.setItem(this.id, JSON.stringify(data['items']));
      },
      e => {
        console.log(e);
      }
    )
  }

  goToView(x: any) { 
    this.journalTableViewId = x.id;
    this.router.navigate(['board', x.board, x.journalId, x.id]).then(
      ()=>{
        this.newItemEvent.emit(x);
      }
    )
  }

  addView(board : string){
    const body ={
      id: this.id, 
      board : board
    }
    this.http.post<any>(environment.api + "Board/addView",body, {
      headers: this.configService.headers(),
     
    }).subscribe(
      data => {
        
        this.httpGet();
        this.modalService.dismissAll();
      },
      e => {
        console.log(e);
        this.modalService.dismissAll();
      }
    )
  }

  update(x:any){
    const body ={
      item: x,  
    }
    this.http.post<any>(environment.api + "Board/update",body, {
      headers: this.configService.headers(),
     
    }).subscribe(
      data => {  
        this.httpGet();
      },
      e => {
        console.log(e);
      }
    )
  }
  
  delete(x:any){
    const body ={
      item: x,  
    }
    this.http.post<any>(environment.api + "Board/delete",body, {
      headers: this.configService.headers(),
     
    }).subscribe(
      data => {  
        this.httpGet();
        if(x.id == this.journalTableViewId){
          this.goToView(data);
        }
        this.modalService.dismissAll();
      },
      e => {
        console.log(e);
        this.modalService.dismissAll();
      }
    )
  }

  open(content: any) {
		this.modalService.open(content);
	}
}
