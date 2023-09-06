import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from 'src/app/service/config.service';

@Component({
  selector: 'app-invited',
  templateUrl: './invited.component.html',
  styleUrls: ['./invited.component.css']
})
export class InvitedComponent implements OnInit {
  id : string = "";
  constructor(
    private activeRouter :ActivatedRoute,
    private configService : ConfigService,
    private router : Router,
  ){}

  ngOnInit() {
    this.id = this.activeRouter.snapshot.queryParams['id'];
    //console.log("dateb", this.id);
    if(this.id ){
     
        this.configService.setGlobalToken("invited.mirrel.com",this.id).subscribe(
          data=>{
            console.log('invited Success!, redirect to check login'); 
            this.router.navigate(['login'],{queryParams:{invited:this.id}});
          },
          error=>{
            console.log("err");
          }
        )
    }
  }
  
}
