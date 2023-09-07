import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from 'src/app/service/config.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-widget-invite',
  templateUrl: './widget-invite.component.html',
  styleUrls: ['./widget-invite.component.css']
})
export class WidgetInviteComponent implements OnInit {
  inviteLink : string = environment.inviteLink;
  isCopy : boolean = false;
  constructor(
    private modalService: NgbModal, 
    private configService: ConfigService, 
    
  ) { }
  ngOnInit(): void {
    this.inviteLink = environment.inviteLink+this.configService.account()['account']['inviteLink'];
    console.log(this.configService.account()['account']['inviteLink']);
  }


  dismiss() {
    this.modalService.dismissAll();
  }
  

  justCopy(){
    this.isCopy = true;
    setTimeout(()=>{
      this.isCopy = false;
    },4000);
  }
}
