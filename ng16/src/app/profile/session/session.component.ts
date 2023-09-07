import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/service/config.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {
  items : any = [];
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) { }
  ngOnInit(): void {
    this.http.get<any>(environment.api + "session/index",{
      headers : this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.items = data['items'];
      },
      error => {
        console.log(error);
      }
    );
  }

}
