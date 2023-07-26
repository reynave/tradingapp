import { Component } from '@angular/core';
interface DataItem {
  id: number;
  name: string;
  address: string;
  area: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  time : number = 1690267027;
  date = new Date('2023-12-01 14:52:48 UTC').toString();
  now = new Date().toString();
  
  data: DataItem[] = [
    { id: 1, name: 'John Doe', address: 'Main Street', area: 'City A' },
    { id: 2, name: 'Jane Smith', address: 'Park Avenue', area: 'City B' },
  ];

  filteredData: DataItem[] = this.data;
  keyword: string = '';
  onSearchChange() {
    if (!this.keyword || this.keyword.trim() === '') {
      this.filteredData = this.data;
    } else {
      this.filteredData = this.data.filter(item => {
        const matchName = item.name.toLowerCase().includes(this.keyword.toLowerCase());
        const matchAddress = item.address.toLowerCase().includes(this.keyword.toLowerCase());
        const matchArea = item.area.toLowerCase().includes(this.keyword.toLowerCase());
        return matchName || matchAddress || matchArea;
      });
    }
  }
}
