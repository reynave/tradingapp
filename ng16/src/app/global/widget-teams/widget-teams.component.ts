import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { environment } from 'src/environments/environment';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface DataTeam {
  id: number;
  email: string;
  name: string;
  picture: string;
}

@Component({
  selector: 'app-widget-teams',
  templateUrl: './widget-teams.component.html',
  styleUrls: ['./widget-teams.component.css']
})
export class WidgetTeamsComponent implements OnInit {
  filterTeams: DataTeam[] = [];
  keyword: string = '';
  teams: any = [];
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private  modalService: NgbModal
  ) { }

  ngOnInit() {
    this.httpGet();
  }

  httpGet() {
    this.http.get<any>(environment.api + "teams/index", {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data);
        this.teams = data['teams'];
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

  open(content: any) {
		this.modalService.open(content);
	}
}
