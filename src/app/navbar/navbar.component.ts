import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../globals';
import { LoginService } from '../login/login.service';
import { stringify } from 'querystring';
import { User } from '../user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  constructor(public globals: Globals,
     private loginService : LoginService,
     private router: Router,
     ) { }

  ngOnInit() {
  }

  logout () {
    this.loginService.getLogoutCSRFToken().subscribe(
      csrf => {

        let csrftoken : string = null;
        if (csrf.hasOwnProperty('CSRF_TOKEN')) {

          csrftoken = csrf.CSRF_TOKEN;
        }

        this.loginService.logout(csrftoken).subscribe(
        result => {
          alert("You have logged out successfully.");
          this.globals.current_user = new User();
          this.router.navigate(['login']);
        },
        error => {alert("An error happened while logging out.")}
        );},
      error => {alert("An error happened while getting logout CSRF Token.")}
    )

  }
}
