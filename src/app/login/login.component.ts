import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user_mail:string;
  user_password:string;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  login(){
    alert("Checking user");
    this.router.navigate(['/main']);
  }

}
