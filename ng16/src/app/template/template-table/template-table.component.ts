import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-template-table',
  templateUrl: './template-table.component.html',
  styleUrls: ['./template-table.component.css'], 
})
export class TemplateTableComponent{
  clipboardImage: string = '';
  rows: string[] = [];
  @ViewChild('imageInput', { static: false }) imageInput: ElementRef | any;
  items = Array.from({ length: 1000 }).map((_, i) => `Item #${i}`);
  constructor() {
    document.addEventListener('paste', this.handlePaste.bind(this));
    for (let i = 0; i < 1000; i++) {
      const row: string[] = [];
      for (let j = 0; j < 26; j++) {
        row.push(`Cell ${i + 1}-${String.fromCharCode(65 + j)}`);
      }
      this.rows.push(row.join(', '));
    }
  }
  removeRow(rowIndex: number) {
    // Hapus elemen dari array berdasarkan indeks
    this.rows.splice(rowIndex, 1);
    console.log("rowIndex",rowIndex);
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
