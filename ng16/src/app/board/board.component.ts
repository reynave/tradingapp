import { Component,  OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  id : string = "";
  journalTableViewId : string = "";
  board : string = "";
  queryParams : any = "";
  constructor(
    private activeRouter : ActivatedRoute,
  ){}

  ngOnInit()  {
    this.getParams();
  }
  reload(event :any){
    this.getParams();
  }
  getParams(){
    this.journalTableViewId =  this.activeRouter.snapshot.queryParams['journalTableViewId'];
    this.board =  this.activeRouter.snapshot.queryParams['board'];
    this.queryParams =  this.activeRouter.snapshot.queryParams;
   // console.log( "queryParams", this.activeRouter.snapshot.queryParams);
  }

   
}
