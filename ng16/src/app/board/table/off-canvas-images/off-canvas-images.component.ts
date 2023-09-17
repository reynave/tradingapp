import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/service/config.service';

@Component({
  selector: 'app-off-canvas-images',
  templateUrl: './off-canvas-images.component.html',
  styleUrls: ['./off-canvas-images.component.css']
})
export class OffCanvasImagesComponent {
  clipboardImage: string = '';
  @ViewChild('imageInput', { static: false }) imageInput: ElementRef | any;

  constructor(
    public activeOffcanvas: NgbActiveOffcanvas, 
    private http: HttpClient,
    private configService: ConfigService,
    
  ) { 
    document.addEventListener('paste', this.handlePaste.bind(this));
  }

  close() {
    this.activeOffcanvas.close();
  }
  handlePaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;

    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
              this.clipboardImage = e.target?.result as string;
              console.log('Gambar di-Paste:', this.clipboardImage);
              
              const body = {
                clipboardImage : this.clipboardImage
              }
              this.http.post<any>(environment.api+"Upload64/base64ToJpg",body,{
                headers: this.configService.headers(),
              }).subscribe(
                  data=>{
                    console.log(data);
                  },
                  error=>{
                    console.log(error);
                  }
              )
            };

            reader.readAsDataURL(blob);
          }
        }else{
          console.log('null paste');
        }
      }
    }
  }
}
