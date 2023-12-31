import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../service/config.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

export class NewBook { 
  constructor( 
    public name: string, 
  ) {}
}
  
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 
  now = new Date().toLocaleString(undefined, { timeZoneName: 'short' });
    
  books: any = [];
  journals: any = [];
  newBook = new NewBook('');
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private router: Router, 
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.httpGet();
    this.httpInvited();
  }

  invited : any = [];
  httpInvited(){
    this.http.get<any>(environment.api + "invited/waitingApproved", {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data);  
        this.invited = data['items'];
      },
      error => {
        console.log(error);
      }

    )
  }

  httpGet() {
    this.http.get<any>(environment.api + "home/welcome", {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data); 
        this.books = data['books'];
        this.journals = data['journals']; 
      },
      error => {
        console.log(error);
      }

    )
  }
   

  fnSlice(str : string){
    return parseInt(str.slice(-3));
  }

  goToJournal(x:any){
    const params = {
      id :  x.journalId,
      journalTableViewId : x.viewId,
      board: 'table'
    }
    this.router.navigate(['board'], { queryParams:params});
  }
  goToBook(x:any){
    this.router.navigate(['book/',x.id]);
  }

  updateTeam(x:any, action :string){

  }
  open(content: any) {
		this.modalService.open(content, {size:'md'});
	}
  onSubmitNewBook(){
    
    const body = {
      newBook : this.newBook,
    }
    this.http.post<any>(environment.api+"book/insert", body,{
      headers: this.configService.headers(),
    }).subscribe(
      data=>{
        //console.log(data); 
        this.router.navigate(['./book',data['id']]).then(()=>{
          this.modalService.dismissAll();
        })
      },
      error=>{
        console.log(error);
      }
    )
  }


  fnRejectInvited(x: any, approved : number){
    const body = {
      item : x,
      approved : approved,
    }
   // console.log(body);
    this.http.post<any>(environment.api+"invited/fnRejectInvited", body,{
      headers: this.configService.headers(),
    }).subscribe(
      data=>{
        console.log(data); 
        this.httpInvited();
      },
      error=>{
        console.log(error);
      }
    )
  }

}
