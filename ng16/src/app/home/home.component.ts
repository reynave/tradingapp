import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  time : number = 1690267027;
  date = new Date('2023-12-01 14:52:48 UTC').toString();
  now = new Date().toString();
  

}
