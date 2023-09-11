import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/service/config.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser'; 

@Component({
  selector: 'app-table-printable',
  templateUrl: './table-printable.component.html',
  styleUrls: ['./table-printable.component.css']
})
export class TablePrintableComponent implements OnInit{ 
  id: string = "";
  journalTableViewId: string = "";
  name: string = "";
 
  loading: boolean = false;
  table: any[] = []; 
  tableHeader: any = []; 
  
  api: string = environment.api;

  constructor(
    private titleService: Title,
    private http: HttpClient, 
    private configService: ConfigService,
    private ativatedRoute: ActivatedRoute, 
  ){ 
  }

  ngOnInit(){ 
  
    this.id = this.ativatedRoute.snapshot.params['id'];
    this.journalTableViewId = this.ativatedRoute.snapshot.params['journalTableViewId'];
    this.httpGet();
  }

  httpGet(){
    this.http.get<any>(environment.api + "Tablesprintable/printable", {
      headers: this.configService.headers(),
      params: {
        id: this.id,
        journalTableViewId: this.journalTableViewId,
      }
    }).subscribe(
      data => {
        console.log('httpGet', data); 
        this.table = data['table'];  
        this.tableHeader = data['tableHeader'];   
        this.titleService.setTitle(data['name']);
        this.name = data['name'];
      },
      e => {
        console.log(e);
      }
    );
  }

  fnPrint(){
    print();
  }
}
