import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/service/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
    private modalService: NgbModal,
    private ativatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

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
        console.log("boardView", data);
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

}
