import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/service/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Output, EventEmitter } from '@angular/core'; 

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
  constructor(
    private http: HttpClient,
    private configService: ConfigService, 
    private ativatedRoute: ActivatedRoute,
    private router: Router,
    config: NgbDropdownConfig
  ) {
    config.placement = 'bottom-end';
	 
   }

  ngOnInit(): void {
    this.id = this.ativatedRoute.snapshot.params['id'];
    this.journalTableViewId = this.ativatedRoute.snapshot.params['journalTableViewId'];
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
         
        this.items = data['items'];
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
      },
      e => {
        console.log(e);
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
      },
      e => {
        console.log(e);
      }
    )
  }

}
