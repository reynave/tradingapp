import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/service/config.service';
@Component({
  selector: 'app-off-canvas-images',
  templateUrl: './off-canvas-images.component.html',
  styleUrls: ['./off-canvas-images.component.css']
})
export class OffCanvasImagesComponent implements OnInit, OnDestroy {
  clipboardImage: string = '';
  @ViewChild('imageInput', { static: false }) imageInput: ElementRef | any;
  @Input() id: any = [];
  @Input() fn: any = [];
  items: any = [];
  url: string = ""; 
  caption : string = "";
  constructor(
    public activeOffcanvas: NgbActiveOffcanvas,
    private http: HttpClient,
    private configService: ConfigService,
  ) {
    // Hapus listener paste yang mungkin sudah ada sebelumnya
    // document.removeEventListener('paste', this.handlePaste);
    // Tambahkan listener paste yang diperlukan 
    document.addEventListener('paste', this.handlePaste.bind(this));
  }
  ngOnInit() {

    this.clipboardImage = "";
    this.httpGet();
    console.log(this.id, this.fn);
  }
  httpGet() {
    this.http.get<any>(environment.api + "images/boardTable", {
      headers: this.configService.headers(),
      params: {
        id: this.id,
        fn: this.fn,
      }
    }).subscribe(
      data => {
        console.log(data);
        this.items = data['items'];
      },
      error => {
        console.log(error);
      }
    )
  }
  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    document.removeEventListener('paste', this.handlePaste);

  }
  close() {

    if (this.clipboardImage || this.url) {
      this.clipboardImage = "";
      this.url = "";
    } else {
      this.activeOffcanvas.dismiss();
    }
  }

  handlePaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    console.log(event, items);

    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
              this.clipboardImage = e.target?.result as string;
              //  console.log('Gambar di-Paste:', this.clipboardImage);
              this.url = "";
             

            };

            reader.readAsDataURL(blob);
          }
        } else {
          console.log('null paste');
        }
      }
    }
  }

  onImagesPost() {
    const body = {
      clipboardImage: this.clipboardImage, 
      caption : this.caption,
      id : this.id,
      fn : this.fn,
    }

    this.clipboardImage = "";
    this.caption = "";

    this.http.post<any>(environment.api + "Upload64/base64ToJpg", body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.httpGet();
      },
      error => {
        console.log(error);
      }
    )
  }
}
