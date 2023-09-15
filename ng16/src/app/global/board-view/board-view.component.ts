import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/service/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Output, EventEmitter } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from 'src/app/service/socket.service';
declare var $: any;

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.css']
})
export class BoardViewComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<string>();
  id: string = "";
  journalTableViewId: string = "";
  items: any = [];
  journalAccess: any = [];
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private ativatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    configDropdown: NgbDropdownConfig,
    config: NgbModalConfig,
    private socketService: SocketService
  ) {
    // configDropdown.placement = 'bottom-end';
    config.backdrop = 'static';
    config.keyboard = false;
  }
  private _docSub: any;
  ngOnInit(): void {

    this.id = this.ativatedRoute.snapshot.params['id'];
    this.journalTableViewId = this.ativatedRoute.snapshot.params['journalTableViewId'];

    const ab: any = localStorage.getItem(this.id);
    this.items = JSON.parse(ab);
    this.httpGet();
    this._docSub = this.socketService.getMessage().subscribe(
      (data: { [x: string]: any; }) => {
        console.log(data);

        if (data['action'] === 'reloadTableVIew') {
          $('.divHiden').hide();
          console.log('carouselx ', $('.carouselx'));
          $('.carouselx').slick('unslick');
          this.httpGet();
        }
        if (data['action'] === 'reloadTableVIewDelete') {
          $('.divHiden').hide();
          $('.carouselx').slick('unslick');
          this.httpGet();
          if (data['id'] == data['journalTableViewId']) {
            this.goToView(data['data']);
          }
        }
      }
    );
  }
  ngOnDestroy() {
    console.log("ngOnDestroy");
  }
  httpGet() {
    this.http.get<any>(environment.api + "Board/view", {
      headers: this.configService.headers(),
      params: {
        id: this.id,
        journalTableViewId: this.journalTableViewId
      }
    }).subscribe(
      data => {
        console.log('httpGet carouselx ', $('.carouselx'));
        this.items = data['items'];
        this.journalAccess = data['journal_access'];
        localStorage.setItem(this.id, JSON.stringify(data['items']));
        this.fnIniSlick();
     
      },
      e => {
        console.log(e);
      }
    )
  }

  fnIniSlick(){

    $(document).ready(function () {
      $('.divHiden').show();
      $('.carouselx').slick({
        slidesToShow: 9,
        slidesToScroll: 3,
        variableWidth: true,
        centerMode: false,
        infinite: false,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 3
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1
            }
          }
        ]
      }); 
    });
  }

  goToView(x: any) {
    console.log(x);
    this.journalTableViewId = x.id;
    this.router.navigate(['board', x.board, x.journalId, x.id]).then(
      () => {
        this.newItemEvent.emit(x);
      }
    )
  }


  addView(board: string) {
    $('.divHiden').hide();
    const body = {
      id: this.id,
      board: board
    }
    this.http.post<any>(environment.api + "Board/addView", body, {
      headers: this.configService.headers(),

    }).subscribe(
      data => {
        const msg = {
          action: 'reloadTableVIew'
        }
        this.socketService.sendMessage(msg);
        //  $('.carouselx').slick('unslick');
        // this.httpGet();
        this.modalService.dismissAll();
      },
      e => {
        console.log(e);
        this.modalService.dismissAll();
      }
    )
  }

  update(x: any) {
    $('.divHiden').hide();
    const body = {
      item: x,
    }
    this.http.post<any>(environment.api + "Board/update", body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        //  $('.carouselx').slick('unslick');
        //  this.httpGet();
        const msg = {
          action: 'reloadTableVIew'
        }
        this.socketService.sendMessage(msg);
      },
      e => {
        console.log(e);
      }
    )
  }

  delete(x: any) {
    $('.divHiden').hide();
    const body = {
      item: x,
    }
    this.http.post<any>(environment.api + "Board/delete", body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        // $('.carouselx').slick('unslick');
        // this.httpGet();
        // if (x.id == this.journalTableViewId) {
        //   this.goToView(data);
        // }
        const msg = {
          action: 'reloadTableVIewDelete',
          id: x.id,
          journalTableViewId: this.journalTableViewId,
          data : data
        }
        this.socketService.sendMessage(msg);
        this.modalService.dismissAll();
      },
      e => {
        console.log(e);
        this.modalService.dismissAll();
      }
    )
  }

  open(content: any) {
    this.modalService.open(content);
  }
}
