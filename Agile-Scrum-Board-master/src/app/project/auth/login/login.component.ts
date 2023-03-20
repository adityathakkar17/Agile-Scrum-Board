import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'
import { JUser } from '@trungk18/interface/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUserData : JUser = new JUser();
  showErrorMessage: boolean;

  constructor(private _auth: AuthService,
              private _router: Router) { }

  ngOnInit() {
  }

  loginUser () {
    if(this.loginUserData.email==null || this.loginUserData.password==null){return window.alert("Please Enter Username/Password")}
    this._auth.loginUser(this.loginUserData)
    .subscribe(
      res => {
        localStorage.setItem('token', res.token)
        localStorage.setItem('userId', res.userId)        
        this._router.navigate(['/project'])
      },
     
      err => {this.showErrorMessage = true;}
    ) 
  }
  dismissError() {
    this.showErrorMessage = false;
  }
}