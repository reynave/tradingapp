import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TradeComponent implements OnInit {

  panels = ['First', 'Second', 'Third'];

  items: any = [];
  constructor(
    private offcanvasService: NgbOffcanvas, 
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    for (let i = 0; i < 100; i++) {
      this.items.push({
        id: i + 1,
        name: "test",
      });
    }
    console.log(this.items);
  }

  openCanvas(content: any) {
    this.offcanvasService.open(content, { position: 'end', panelClass: 'details-panel', }).result.then(
      (result) => {
        console.log("load data");
      },
      (reason) => {
				 
			},
    );
  }


  openModalFullscreen(content: any) {
    this.modalService.open(content, { fullscreen: true }).result.then(
			(result) => {
				 
			},
			(reason) => {
			 
			},
		);
  }

}
