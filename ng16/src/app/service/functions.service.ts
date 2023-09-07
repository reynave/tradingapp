import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor(
    private http: HttpClient,
    private configService : ConfigService
  ) { }

  getHourDifference(
    openDate: { year: number; month: number; day: number | undefined; }, 
    openTime: { hour: number; minute: number | undefined;},  
    closeDate: { year: number; month: number; day: number | undefined; },
    closeTime: { hour: number; minute: number | undefined;},  
  ) {
    const openDateTime = new Date(openDate.year, openDate.month - 1, openDate.day, openTime.hour, openTime.minute,0);
    //console.log(openDateTime, openDate,openTime);
    const closeDateTime = new Date(closeDate.year, closeDate.month - 1, closeDate.day, closeTime.hour, closeTime.minute);
    // const openDateTime = this.createValidDate(openDate.year, openDate.month - 1, openDate.day, openTime.hour, openTime.minute);
    // console.log(openDateTime);
    //  const closeDateTime = this.createValidDate(closeDate.year, closeDate.month - 1, closeDate.day, closeTime.hour, closeTime.minute);
    
    const diffInMilliseconds = closeDateTime.getTime() - openDateTime.getTime();
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
  
    return diffInHours;
  }

  createValidDate(year: number, month: number, day: number | undefined, hour: number, minute: number | undefined) {
    const validMonth = month - 1; // Kurangi 1 dari bulan karena bulan dimulai dari 0 (Januari = 0, Februari = 1, dst.)
    const validHour = Number.isInteger(hour) ? hour : 0; // Gunakan 0 jika jam tidak valid
    const validMinute = Number.isInteger(minute) ? minute : 0; // Gunakan 0 jika menit tidak valid
  
    return new Date(year, validMonth, day, validHour, validMinute);
  }

  hourToDays(val : number){
    return "hourToDays (SOON)";
  }

  uploadImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('userfile', image);
    formData.append('jti', this.configService.jti()); 

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(environment.api+"upload/profilePicture", formData, { headers });
  }
}
