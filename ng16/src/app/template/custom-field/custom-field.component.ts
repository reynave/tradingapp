import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'; 

@Component({
  selector: 'app-custom-field',
  templateUrl: './custom-field.component.html',
  styleUrls: ['./custom-field.component.css']
})
export class CustomFieldComponent implements OnInit{ 
  @Input() item :any = [];
 // @Input() itemSelect :any = [];
  @Output() newItemEvent = new EventEmitter<string>();
   
  childItem: any; 
  ngOnInit(): void {
    this.childItem = { ...this.item };
  }
   
  emitToParent(newValue: string) { 
    this.newItemEvent.emit(this.childItem);
  }
  emitModalEditSelect(){
    this.childItem.itype= "editSelect";
    console.log(this.childItem);
    this.newItemEvent.emit( this.childItem);
  }

  background(value:string){
    let objIndex = this.childItem.select.option.findIndex(((obj: { value: string; }) => obj.value == value ));
    if(objIndex > -1){
      return this.childItem.select.option[objIndex]['background'];
    }else{
      return 'auto';
    } 
  }

  emitSelectToParent(newValue: string) { 
    console.log(newValue);
    this.childItem.value = newValue;
    console.log(this.childItem); 
    //this.childItem.newItem.value = newValue;
    this.newItemEvent.emit(this.childItem);
  }


  openCanvas(content: any) {
    console.log(content);
  }
}
