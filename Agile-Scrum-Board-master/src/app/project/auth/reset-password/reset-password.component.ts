import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

   password : string = "";
   userId: string;
  constructor(private route: ActivatedRoute,private _auth: AuthService,private _router: Router) { }

  ngOnInit(): void {
    
  }

  resetPassword(){
    this.userId = this.route.snapshot.queryParamMap.get('id');
    console.log(this.userId);
    this._auth.resetpassword(this.password,this.userId)
    .subscribe(
      res => {
          console.log(res);
          window.alert(res.message);
          this._router.navigate(['/login'])
      },   
      err => {
        window.alert(err.message);
      }
    ) 
  }

}
