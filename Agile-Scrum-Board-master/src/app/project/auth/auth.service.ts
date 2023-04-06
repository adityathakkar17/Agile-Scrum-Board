import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'

@Injectable()
export class AuthService {

  private _registerUrl = "http://localhost:3000/api/register";
  private _loginUrl = "http://localhost:3000/api/login";
  private _forgotpasswordurl = "http://localhost:3000/api/Forgotpassword";
  private _resetpasswordurl = "http://localhost:3000/api/reset-password";

  constructor(private http: HttpClient,
              private _router: Router) { }

  registerUser(user:any) {
    return this.http.post<any>(this._registerUrl, user)
  }

  loginUser(user:any) {
    //console.log(user)
    return this.http.post<any>(this._loginUrl, user)
  }

  logoutUser() {
    localStorage.removeItem('token')
    this._router.navigate(['/login'])
  }

  getToken() {
    return localStorage.getItem('token')
  }

  loggedIn() {
    return !!localStorage.getItem('token')    
  }
  forgotpassword(email:string){
    console.log("inservice file " + email);
   return this.http.get<any>(`${this._forgotpasswordurl}/${email}`);
  }

  resetpassword(password:string ,userid:string)
  {
    return this.http.post<any>(this._resetpasswordurl,{"password":password,"userid":userid})
  }
}