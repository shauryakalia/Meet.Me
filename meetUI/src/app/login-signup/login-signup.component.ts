import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})
export class LoginSignupComponent implements OnInit {

  onLogin: boolean;
  constructor() { }

  ngOnInit() {
    this.onLogin = true;
  }
  swithToSignup() {
    this.onLogin = false
  }
  switchToLogin() {
    this.onLogin = true
  }
}