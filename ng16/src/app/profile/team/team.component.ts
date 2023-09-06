import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/service/config.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  account_team: any = [];
  constructor(
    private configService: ConfigService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.httpGet();
  }
  httpGet() {
    this.http.get<any>(environment.api + "team/index",{
      headers : this.configService.headers(),
    }).subscribe(
      data => {
        this.account_team = data['account_team']
        console.log(data);
      },
      error => {
        console.log(error);
      } 
    )
  }
}
