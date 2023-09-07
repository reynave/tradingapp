import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from 'src/app/service/config.service';
import { environment } from 'src/environments/environment'; 
import { WidgetInviteComponent } from 'src/app/global/widget-invite/widget-invite.component';
interface DataTeam {
  username: string;
  email: string;
  id: string;
  input_date: string;
  name: string;
  picture: string;
  status: string;  
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  account_team: any = [];
  teams: any = [];
  filterTeams: DataTeam[] = [];
  keyword: string = '';
  constructor(
    private configService: ConfigService,
    private http: HttpClient, 
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.httpGet();
  }
  httpGet() {
    this.http.get<any>(environment.api + "team/index", {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        this.teams = data['account_team'];
        this.filterTeams = data['account_team'];
        console.log(data);
      },
      error => {
        console.log(error);
      }
    )
  }

  onSearchChange() { 
    if (!this.keyword  ) {
      this.filterTeams = this.teams;
     
    } else {
      this.filterTeams = this.teams.filter((item: { name: string; email: string; username: string; } ) => {
        
        const matchName = item.name.toLowerCase().includes(this.keyword.toLowerCase());
        const matchEmail = item.email.toLowerCase().includes(this.keyword.toLowerCase());
        const matchUsername = item.username.toLowerCase().includes(this.keyword.toLowerCase());

        return matchName || matchEmail || matchUsername;
      });
    }
  }

  open() {
		const modalRef = this.modalService.open(WidgetInviteComponent);
		modalRef.componentInstance.name = 'World';
	}

}
