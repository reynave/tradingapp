import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/service/config.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
  inputPass1: string = "";
  inputPass2: string = "";
  inputOldPass: string = "";

  password: string[] = ["password", "password", "password"];
  hasPassword: boolean = false;
  username: string = "";
  accountId: string = "";
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.username = this.configService.account()['account']['username'];
    this.accountId = this.configService.account()['account']['id'];
    this.httpGet();
  }
  httpGet() {
    this.http.get<any>(environment.api + "Security/index", {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data);
        this.hasPassword = data['hasPassword'];
        this.inputPass1 = "";
        this.inputPass2  = "";
        this.inputOldPass  = "";
      },
      error => {
        console.log(error);
      }
    )
  }
  note : string = "";
  changePassword() {
    this.note = "";
    const hash0 = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(this.inputOldPass));
    const md5p0 = hash0.toString(CryptoJS.enc.Hex);

    const hash1 = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(this.inputPass1));
    const md5p1 = hash1.toString(CryptoJS.enc.Hex);

    const hash2 = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(this.inputPass2));
    const md5p2 = hash2.toString(CryptoJS.enc.Hex);
    console.log(md5p1,md5p2);
    if (md5p1 == md5p2) { 
      const body = {
        oldPassword : md5p0,
        password: md5p1,
      }
      this.http.post<any>(environment.api + "Security/changePassword", body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          this.httpGet();
          this.note = data['note'];
          console.log(data);
          this.hasPassword = data['hasPassword'];
          
        },
        error => {
          console.log(error);
        }
      );
    }else{
      this.note = "Password not match";
    }
  }
  showPassword(no: number) {
    console.log(this.password[0]);
    if (this.password[no] == 'password') {
      this.password[no] = 'text';
    }
    else if (this.password[no] == 'text') {
      this.password[no] = 'password';
    }
  }
}
