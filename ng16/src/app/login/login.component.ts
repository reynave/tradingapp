import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from 'src/app/service/config.service';
import * as CryptoJS from 'crypto-js';

export class Login {
  constructor(
    public email: string,
    public passw: string,
  ) { }

}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = new Login('', '');
  loading: boolean = false;
  api: string = environment.api;
  env : any = environment;
  note: string = "loading...";
  id: string = "";
  relogin: boolean = false;
  constructor(
    private http: HttpClient,
    private router: Router,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,

  ) { }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.queryParams['id'];
    if (this.id) {
      this.httpGet(this.id);
    }else{
      this.relogin = true;
      this.note = "Cannot find login session!";
    }
  }

  httpGet(id: string) { 
      console.log(id);
      this.http.get<any>(environment.api + "login/checkTokenAsLogin", {
        params: {
          id: this.id,
        }
      }).subscribe(
        data => {
          console.log(data);
          if (data['token'] != "" && data['error'] == false) {
            this.note = "Success";
            this.relogin = false;
            localStorage.setItem("app.mirrel.com", data['token']);
            this.router.navigate(['/home']).then(
              ()=>{
                this.clearOneShotToken(this.id).subscribe(
                  data=>{
                    console.log(data);
                  },
                  e =>{
                    console.log(e);
                  }
                )
              }
            )
          } else {
            localStorage.removeItem("app.mirrel.com");
            this.relogin = true;
            this.note = "Login expired, please relogin again !";
          }
        },
        e => {
          console.log(e);
        },

      )
    
  }

  clearOneShotToken(idToken:string){
    const body = {
      id : idToken
    }
    return this.http.post(environment.api+"login/clearOneShotToken", body);
  }

  onSubmit() {
    this.loading = true;
    this.note = "Loading..!";
    const hash = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(this.model['passw']));
    const md5 = hash.toString(CryptoJS.enc.Hex);

    const body = {
      email: this.model['email'],
      pass: md5,
      player_id: "",
      ver: environment.ver
    }

    this.http.post<any>(this.api + 'login/auth', body).subscribe(
      data => {
        this.loading = false;
        console.log(data);
        if (data['error'] !== true) {
          this.note = "Login Success ";
          this.configService.setToken(data['token']).subscribe(
            data => {
              if (data) {
                console.log('Token set successfully');
                this.router.navigate(['home']);
              } else {
                console.error('Failed to set token');
              }
            });

        } else {
          this.note = "Login fail!";
        }
      },
      e => {
        console.log(e);
        this.note = "Error Server!";
      },
    );


  }


}