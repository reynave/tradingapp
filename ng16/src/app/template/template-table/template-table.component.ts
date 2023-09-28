import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-template-table',
  templateUrl: './template-table.component.html',
  styleUrls: ['./template-table.component.css'],
})
export class TemplateTableComponent {
  data: string[][] = [];
  headers: string[] = [];

  constructor() {
    // Generate headers (20 columns)
    for (let i = 1; i <= 15; i++) {
      this.headers.push(`Header ${i}`);
    }

    // Generate data (1000 rows x 20 columns)
    for (let row = 1; row <= 1000; row++) {
      const rowData: string[] = [];
      for (let col = 1; col <= 20; col++) {
        rowData.push(`Data ${row}-${col}`);
      }
      this.data.push(rowData);
    }
  }

  isScollX : number = 0;
  onScroll(event: Event): void {
    const dataContainer = event.target as HTMLElement;
    const verticalScrollY = dataContainer.scrollTop; // Mendapatkan nilai Y
    const horizontalScrollX = dataContainer.scrollLeft; // Mendapatkan nilai X

    // Sekarang Anda dapat menggunakan nilai Y dan X sesuai kebutuhan
    console.log('Scroll Y:', verticalScrollY);
    console.log('Scroll X:', horizontalScrollX);
  }

}
