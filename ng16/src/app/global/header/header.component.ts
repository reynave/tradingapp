import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/service/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';


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
  items: any = [];
  id : string = "";
  newBook = new NewBook('');
  currentRate : number = 6;
  myRating = new MyRating("",this.currentRate);
 
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private route: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute 
  ) { }

  ngOnInit(): void { 
    console.log(this.configService.account())
    this.account = this.configService.account();
    console.log(this.configService.jti())
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
        console.log(data);
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

  onSubmitNewBook(){
    console.log(this.newBook);
    const body = {
      newBook : this.newBook,
    }
    this.http.post<any>(environment.api+"book/insert", body,{
      headers: this.configService.headers(),
    }).subscribe(
      data=>{
        console.log(data);
        
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
