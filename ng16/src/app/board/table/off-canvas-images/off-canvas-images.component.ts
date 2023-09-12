import { Component } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-off-canvas-images',
  templateUrl: './off-canvas-images.component.html',
  styleUrls: ['./off-canvas-images.component.css']
})
export class OffCanvasImagesComponent {
  constructor(
    public activeOffcanvas: NgbActiveOffcanvas
  ){}

  close(){
    this.activeOffcanvas.dismiss();
  }
}
