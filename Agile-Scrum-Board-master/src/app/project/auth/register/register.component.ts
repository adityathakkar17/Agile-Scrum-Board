import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'
import { JUser } from '@trungk18/interface/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerUserData : JUser= new JUser();
  showErrorMessage: boolean;
  constructor(private _auth: AuthService,
              private _router: Router) { }

  ngOnInit() {
  }

  registerUser() {
    this._auth.registerUser(this.registerUserData)
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