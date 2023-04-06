import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

@Injectable()
export class ForgotPasswordComponent implements OnInit {
  email : string = "";
  private _forgotpasswordurl = "http://localhost:3000/api/Forgotpassword";
  constructor(private http: HttpClient,private _auth: AuthService,private _router: Router) { }

  ngOnInit(): void {
  }
  sendResetLink(){
    console.log("heree" + this.email);
    this._auth.forgotpassword(this.email)
    .subscribe(
      res => {
          console.log(res)
          window.alert("Email sent Successfully to your email..");
          this._router.navigate(['/login'])
      },   
      err => {}
    ) 
      
  }

}
