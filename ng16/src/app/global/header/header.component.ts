import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ConfigService } from 'src/app/service/config.service';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private route: Router, 
  ){}

  ngOnInit(): void {
   // this.checkJwtToken();
  }

  checkJwtToken(){
    this.http.get<any>(environment.api+"token/validateToken",{
      headers : this.configService.headers()
    }).subscribe(
      data=>{ 
        console.log(data);
      }, 
      e=>{ 
        console.log(e);
        if(e.error.code != 404){
          console.log(e.error.code," Token unauthorized / error"); 
          this.logout();
        }
        
      }
    )
  }

  logout(){
    this.configService.removeToken().subscribe(
      ()=>{
        this.route.navigate(['login']);
      }
    )
  }

}
