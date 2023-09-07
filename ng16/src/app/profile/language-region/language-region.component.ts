import { Component, OnInit } from '@angular/core';
import { timezoneObj }   from './timezones' // Sesuaikan jalur file dengan proyek Anda

@Component({
  selector: 'app-language-region',
  templateUrl: './language-region.component.html',
  styleUrls: ['./language-region.component.css']
})
export class LanguageRegionComponent implements OnInit { 
  timezoneObj : any = timezoneObj;
  timezoneVal : any = "";
  ngOnInit(): void { 
    this.timezoneVal = localStorage.getItem('timezon.mirrel.com');
  }
  updateTimeZone(){ 
    localStorage.setItem("timezon.mirrel.com",this.timezoneVal);
  }
}
