import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from 'src/app/service/config.service';
import { FunctionsService } from 'src/app/service/functions.service';
import { environment } from 'src/environments/environment'; 
export class Hero {
  constructor(
    public description: string,  
    public name: string,
    public party: string,
    public username: string
  ) {  }
}
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html', 
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  active = 1;
  lock : boolean = true;
  id : string = ""; 
  profile : any = new Hero("","","","");
  user : any = [];
  env : any = environment;
  journals : any = [];
  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private acvtiveRouter : ActivatedRoute, 
    private functionsService : FunctionsService,
  ) { }

  ngOnInit() {
    this.id = this.acvtiveRouter.snapshot.params['id'];
    this.httpProfile(); 
  }
  httpProfile() {
    this.http.get<any>(environment.api + "profile/user/"+this.id, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        this.profile.description = data['profile']['description'];
        this.profile.name       = data['profile']['name']; 
        this.profile.username   = data['profile']['username'];
        this.profile.party   = data['profile']['party'];
        this.journals  = data['journals']; 
        this.user = data['profile'];
        this.lock = data['lock'];

        console.log(data);
      },
      error => {
        console.log(error);
      }
    )
  }
  
  

  saved : boolean = false;
  onSubmitProfile(){
    console.log(this.profile);
    const body = {
      profile : this.profile,
      id : this.id
    }
    this.http.post<any>(environment.api+"profile/update",body,{
      headers:this.configService.headers()
    }).subscribe(
      data=>{
        console.log(data);
        if(data['error'] == false ){
          this.saved = true;
        }
      },
      error => {
        console.log(error);
      }
    )
  }


  selectedFile: File | null = null;
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File; 
    this.uploadImage();
  }

  errors : string = '';
  uploadImage(): void {
    if (!this.selectedFile) {
      return;
    } 
    this.functionsService.uploadImage(this.selectedFile).subscribe(response => {
      console.log('Image successfully uploaded:', response);
      this.errors = response['errors']['file'];
    }, error => {
      console.error('There is an error:', error);
    });
  }
 
}
