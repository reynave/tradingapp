import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/service/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';  
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { WidgetInviteComponent } from '../widget-invite/widget-invite.component';

export class NewBook { 
  constructor( 
    public name: string, 
  ) {}
}

export class MyRating { 
  constructor( 
    public msg: string, 
    public rating: number,  
  ) {}
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnChanges {
  @Output() sendToParent = new EventEmitter<any>();
  @Input() item: any = [];
  account : any = [];
  accountId : string = "";
  bookmark : string = environment.website;
  items: any = [];
  id : string = "";
  newBook = new NewBook('');
  currentRate : number = 6;
  myRating = new MyRating("",this.currentRate);
  picture : string = "";
  constructor(
    private titleService: Title,
    private http: HttpClient,
    private configService: ConfigService,
    private route: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute 
  ) { }

  ngOnInit(): void {  
    this.account = this.configService.account();
    this.accountId = this.configService.account()['account']['id'];
    this.picture = environment.api+'uploads/picture/'+this.configService.account()['account']['picture'];
    //console.log(this.configService.jti())
    //console.log(this.activatedRoute);
    this.titleService.setTitle("Mirrel.com");
    this.bookmark  = environment.website+this.configService.account()['account']['username']+"#bookmark";
    this.checkJwtToken();
    this.httpGet();
    this.getId();
  }

  getId(){
     this.id = this.activatedRoute.snapshot.params['id'];
  }

  ngOnChanges(changes: any = []) {
    if (this.item['sender'] == 'book') { 
      this.updateNavigator();
    }

  }

  updateNavigator() {
    if (this.items.length > 1 && this.items !== 'undefined') {
      let objIndex = this.items.findIndex(((obj: { id: any; }) => obj.id == this.item.id));
      //this.items[objIndex]['name'] = this.item['name'];
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
        this.id  = x.id;
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
//        console.log(data);
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

  open(content: any) {
		this.modalService.open(content, {size:'md'});
	}

  openCollab() {
		const modalRef = this.modalService.open(WidgetInviteComponent);
		modalRef.componentInstance.name = 'World';
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
        
        this.route.navigate(['./book',data['id']]).then(()=>{
          location.reload();
        })
      },
      error=>{
        console.log(error);
      }
    )
  }

}
