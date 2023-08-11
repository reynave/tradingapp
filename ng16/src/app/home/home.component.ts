import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../service/config.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

interface DataItem {
  id: number;
  name: string;
  address: string;
  area: string;
}

interface DataTeam {
  id: number;
  email: string;
  name: string;
  picture: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  time: number = 1690267027;
  date = new Date('2023-12-01 14:52:48 UTC').toString();
  now = new Date().toString();
  
  filterTeams: DataTeam[] = [];
  keyword: string = '';
  teams: any = [];
  books: any = [];
  journals: any = [];

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.httpGet();
  }

  httpGet() {
    this.http.get<any>(environment.api + "home/welcome", {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data);
        this.teams = data['teams'];
        this.books = data['books'];
        this.journals = data['journals'];
        this.filterTeams = this.teams;
      },
      error => {
        console.log(error);
      }

    )
  }
  
  onSearchChange() {
    if (!this.keyword || this.keyword.trim() === '') { 
      this.filterTeams = this.teams;
    } else {
      this.filterTeams = this.teams.filter((item: { name: string; email: string; }) => { 
        const matchName = item.name.toLowerCase().includes(this.keyword.toLowerCase());
        const matchEmail = item.email.toLowerCase().includes(this.keyword.toLowerCase());
        
        return matchName || matchEmail;
      });
    }
  }

  fnSlice(str : string){
    return parseInt(str.slice(-3));
  }

  goToJournal(x:any){
    this.router.navigate(['board/table/',x.journalId,x.viewId]);
  }
  goToBook(x:any){
    this.router.navigate(['book/',x.id]);
  }

  updateTeam(x:any, action :string){

  }
}
