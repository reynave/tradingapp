import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from 'src/app/service/config.service';
import { environment } from 'src/environments/environment';

interface WeeklyData {
  day: string;
  date: string;
  strtime: string;
  data: {
    profit: number;
  };
}

 

interface Timeline { 
  date : string;
  weekly: WeeklyData[]; 
  data : any;
}

@Component({
  selector: 'app-board-timeline',
  templateUrl: './board-timeline.component.html',
  styleUrls: ['./board-timeline.component.css']
})
export class BoardTimelineComponent implements OnInit {

  timeline : Timeline[] = [];
  journalId : string = "";
  loading : boolean = false;
  constructor(
    private http:HttpClient,
    private configService :ConfigService,
    private router : Router,
    private activeRouter : ActivatedRoute,
  ){}

  ngOnInit(): void {
     this.journalId = this.activeRouter.snapshot.queryParams['id']; 
     this.httpGet();
  }
  
  httpGet(){
    this.loading = true;
    this.http.get<any>(environment.api+'calendar',{
      headers : this.configService.headers(),
      params : {
        journalId : this.journalId
      }
    }).subscribe(
      data=>{
        this.loading = false;
        this.timeline = data['timeline']['data'];
        console.log(this.timeline );
      },
      error=>{
        console.log(error);
      }
    )
  }

}
