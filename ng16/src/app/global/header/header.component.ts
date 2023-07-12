import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ConfigService } from 'src/app/service/config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnChanges {
  @Output() sendToParent = new EventEmitter<any>();
  @Input() item: any = [];

  items: any = [];
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private route: Router,
  ) { }

  ngOnInit(): void {
    this.checkJwtToken();
    this.httpGet();
  }
  ngOnChanges(changes: any) {
   
    if ( this.item['sender'] == 'book') {
       
      this.updateNavigator();
    }

  }

  updateNavigator() {
    if (this.items.length > 1 &&  this.items !== 'undefined') {
      let objIndex = this.items.findIndex(((obj: { id: any; }) => obj.id == this.item.id));
      this.items[objIndex]['name'] = this.item.name;
    }
  }


  httpGet() {
    this.http.get<any>(environment.api + "book", {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        
        this.items = data['items'];

      },
      e => {
        console.log(e);
      }
    )
  }

  navigator(x: any) {
    this.route.navigate(['book', x.id]).then(
      () => {
        const body = {
          id: x.id
        }
        this.sendToParent.emit(body);
      }
    )
  }

  checkJwtToken() {
    this.http.get<any>(environment.api + "token/validateToken", {
      headers: this.configService.headers()
    }).subscribe(
      data => {
         
      },
      e => {
        console.log(e);
        if (e.error.code == 500) {
          console.log(e.error.code, " Token unauthorized / error");
          this.logout();
        }

      }
    )
  }

  logout() {
    this.configService.removeToken().subscribe(
      () => {
        this.route.navigate(['login']);
      }
    )
  }

}
