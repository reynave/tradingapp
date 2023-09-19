import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-template-table',
  templateUrl: './template-table.component.html',
  styleUrls: ['./template-table.component.css'], 
})
export class TemplateTableComponent{
  clipboardImage: string = '';
  @ViewChild('imageInput', { static: false }) imageInput: ElementRef | any;
  items = Array.from({ length: 1000 }).map((_, i) => `Item #${i}`);
  constructor() {
    document.addEventListener('paste', this.handlePaste.bind(this));
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
            };

            reader.readAsDataURL(blob);
          }
        }
      }
    }
  }
  
}
