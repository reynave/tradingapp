import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/service/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; 
import { ShareBoardComponent } from '../template/share-board/share-board.component';

declare var $: any;

export class Hero { 
  constructor( 
    public name: string,
    public permissionId: string,
    public template: string,
    public startBalance: number,
    public sample: string,
    
  ) {  }
}
@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  newJournal: string = "";
  id: string = "";
  items: any = [];
  chart: any = [];
  permission: any = [];
  loading: boolean = false;
  item: any = [];
  journalAccess: any = [];
  addUser: string = "";
  book: any = [];
  bookSelect : any = [];
  editable :any = {
    title : false,
  }
  templatejson : any = [];
  model = new Hero("","1","journalFXTrading",0,"");

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private http: HttpClient,
    private configService: ConfigService, 
    private modalService: NgbModal, 
  ) { }

  public onChild(obj: any) { 
    console.log('obj child : ', );
    this.id = obj['id'];
    this.httpGet();
  }

  public updateHeader(){
    const data = {
      sender : 'book',
      id : this.book.id,
      name : this.book.name,
    }
    return data;
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params["id"];
    this.httpGet();
  }

  onBlur(){
    console.log("onBlur");
    this.editable.title = false;
  }
  
  onFocus(book : any){
    if(book.ilock == 0){
      console.log("onFocus");
      this.editable.title = true; 
      setTimeout(function(){
        $("#bookTitle").focus();
        console.log("set Fokus");
      },100)
    } 

  }

  httpGet() {
    this.editable.title = false;  
    this.http.get<any>(environment.api + "journal/index/" + this.id, {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data);
        this.permission = data['permission'];
        this.items = data['items']; 
        this.book = data['book'];
        this.bookSelect = data['bookSelect'];
        this.templatejson = data['templatejson'];
        this.showBtnTrashBin();
        var self = this;
        $(function () {
          $(".sortable").sortable({
            handle: ".handle",
            update: function (event: any, ui: any) {
              const order: any[] = [];
              $(".sortable .handle").each((index: number, element: any) => {
                const itemId = $(element).attr("id");
                order.push(itemId);
              });
           //   console.log(order);

              self.http.post<any>(environment.api + "journal/sorting", order, {
                headers: self.configService.headers(),
              }).subscribe(
                data => {
                 // console.log(data);
                 //  console.log(self.items)  
                },
                e => {
                  console.log(e);
                }
              )

            }
          });
        });
      },
      e => {
        console.log(e);
      }
    )
  }
 
  delete(){
    if(confirm("Delete "+this.book['name']+ "'s book ? ")){
      const body = {
        book: this.book,
      }
      this.http.post<any>(environment.api+"book/delete",body,{
        headers : this.configService.headers(),
      }).subscribe(
        data=>{
          console.log(data); 
          this.router.navigate(['home']);
        },
        error=>{

        }
      )
    }
  }

  onChangesBook(book:any, item:any, index:number){
    console.log(book,item);
    const body ={
      book : book,
      item : item
    }
    console.log(body);
    this.items[index]['bookId'] = book.id;
    this.http.post<any>(environment.api + "journal/onChangesBook", body, {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data); 
       // this.httpGet();
      },
      e => {
        console.log(e);
      }
    )
  }

  fnEditableChange(){
    if (this.book.name != "") {
      console.log(this.book);
    
      const body = {
        book: this.book, 
        id: this.id
      }
      this.http.post<any>(environment.api + "journal/fnEditableChange", body, {
        headers: this.configService.headers()
      }).subscribe(
        data => { 
          console.log(data);
          this.editable.title = false;  
        },
        e => {
          console.log(e);
        }
      )
    }
    
  }

  onCreateNew() {
    if (this.model.name != "") {
 
      const body = {
        insert: true,
        model: this.model,
        id: this.id
      }
      this.http.post<any>(environment.api + "journal/onCreateNew", body, {
        headers: this.configService.headers()
      }).subscribe(
        data => {
          console.log(data);
          this.model.name = "";
          this.modalService.dismissAll();
          this.httpGet();
        },
        e => {
          console.log(e);
        }
      )
    }
  }
 
  open(content: any) { 
    this.modalService.open(content, { size: 'md' }); 
  }
  onSubmit(){

  }

  fnClearTrashBin() {
    const body = {
      remove: true,
      bookId : this.book.id,
    }
    this.http.post<any>(environment.api + "journal/fnClearTrashBin", body, {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data);
        this.httpGet();
      },
      e => {
        console.log(e);
      }
    )
  }

  fnDeleteAll() {
    if (confirm("Delete all check list ?")) {
      const body = {
        items: this.items,
      }
      this.http.post<any>(environment.api + "journal/fnDeleteAll", body, {
        headers: this.configService.headers()
      }).subscribe(
        data => {
          console.log(data);
          this.httpGet();
        },
        e => {
          console.log(e);
        }
      )
    }
  }

  itemSetting(x: any) {
    let isDelete = false;
    if (x.presence == '1' && x.admin == '1') {
      isDelete = true;
    }
    return isDelete;
  }
  
  openComponent(componentName: string, item:any) {
    if (componentName == 'ShareBoardComponent') {
      const modalRef = this.modalService.open(ShareBoardComponent, { size: 'lg' });
      modalRef.componentInstance.item = item;
      modalRef.componentInstance.permission = this.permission;
  
      modalRef.componentInstance.newItemEvent.subscribe((data: any) => {
        console.log(data);
      });
    }
  }

  updateStar(x:any){
    
    const body = {
      journal : x,  
    }
    this.http.post<any>(environment.api + "journal/updateStar", body, {
      headers: this.configService.headers()
    }).subscribe( 
      data=> { 
          console.log(data); 
      },
      error => {
        console.log(error);
      }
    )
  }

  tools : boolean = false;
  fnTools() {
    this.tools = false;
    this.items.forEach((el: any) => {
      if (el.checkbox == true) {
        this.tools = true;
        return;
      }
    });  
  }

  btnTrashBin : boolean = false;
  showBtnTrashBin() {
    this.btnTrashBin = false;
    this.items.forEach((el: any) => {
      if (el.presence == '4') {
        this.btnTrashBin = true;
        return;
      }
    });  
  }

}
