import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-custom-field-form',
  templateUrl: './custom-field-form.component.html',
  styleUrls: ['./custom-field-form.component.css']
})
export class CustomFieldFormComponent {
	@Input() customFieldForm: any;
}
