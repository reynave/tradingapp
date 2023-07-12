import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbOffcanvas, NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
  selector: 'app-template-table',
  templateUrl: './template-table.component.html',
  styleUrls: ['./template-table.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TemplateTableComponent implements OnInit{
  leftSide : boolean = true;
  panels = ['First', 'Second', 'Third'];
  fields: any = [];
  items: any = [];

  currentItem : any = {
    id : 1,
    value : "Sayama AI",
    itype : "text",
  };

  constructor(
    private offcanvasService: NgbOffcanvas, 
    private modalService: NgbModal, 
    private calendar: NgbCalendar
  ) { }

  onChild(newItem: any) {
     console.log(newItem)
  }
  ngOnInit(): void {
  
    for (let i = 0; i < 100; i++) {
      this.items.push({
        id: i + 1,
        name: "test "+i,
        itype: ( i % 5 == 0) ? 'select':'text',
        value : "value "+i, 
      });
    }
    for (let i = 0; i < 15; i++) {
      this.fields.push({
        id: i + 1,
        name: "Name_"+(i*7),
      });
     
    }
    console.log(this.items); 
  }

  focusSelect(){
    console.log("date");
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

    $(function () {
      $( ".resizable" ).resizable({ 
        maxHeight: 33,
        minHeight: 33,
      });
      $(".sortable").sortable({
        handle: ".handle",
        placeholder: "ui-state-highlight",
        update: function (event: any, ui: any) {
          const order: any[] = [];
          $(".sortable .handle").each((index: number, element: any) => {
            const itemId = $(element).attr("id");
            order.push(itemId);
          });

          console.log(order);

        }
      });
    });
  }

  update(){
    console.log("update");
  }

  
}
