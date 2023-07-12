import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-field',
  templateUrl: './custom-field.component.html',
  styleUrls: ['./custom-field.component.css']
})
export class CustomFieldComponent {
  @Output() newItemEvent = new EventEmitter<string>();
  @Input() item :any = [];
  @Input() itemSelect :any = [];


  emitToParent(value: string) {
    this.newItemEvent.emit(value);
  }
}
