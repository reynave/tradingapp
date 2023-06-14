import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  getToken(){
    return "123";
  }

  headers() { 
    return  new HttpHeaders({
      'Content-Type': 'application/json', 
      'Token': this.getToken(),
    });
  } 
}
