import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Globals } from '../globals';
import { LoginService } from './login.service';
import { User } from '../user';
import { ConditionalExpr } from '@angular/compiler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})



export class LoginComponent implements OnInit {

  private user: string;
  private user_password: string;
  success = false;
  error = false;
  tmpdivHtml: SafeHtml;
  parsedCsrfInputTag: any;

  @ViewChild("tmpdiv",{static: true}) tmpdiv: ElementRef;


  constructor(private router: Router, public globals: Globals,
              private service: LoginService,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {

  }

  getUserInfo (csrftoken: string) {
    this.service.getUser(this.user,this.user_password, csrftoken).subscribe(
      result => {
        this.globals.actual_user = new User();
        this.globals.actual_user.id = result.id;
        this.globals.actual_user.name = result.first_name+' '+result.last_name;
        this.globals.actual_user.mail = result.email;
        this.globals.actual_user.projects = {};
        this.service.getProjects().subscribe(
          result2 => {
            for (const projects of result2) {
              this.globals.actual_user.projects[projects.name] = projects.id;
            }
            setTimeout(() => {
              this.router.navigate(['/main']);
            },
            1000);
          },
          error => {
            alert('Error getting user projects.');
          }
        );
      },
      error => {
        if (error.status === 401) {
          alert('Invalid username or password.');
        } else {
          alert('Cannot login.');
        }
        
      },
      () => {
        this.user_password = '';
      }
    );
  }

  login() {
    this.error = false;
    const newLocal = this.success = false;
    this.service.getUserCSRFToken().subscribe(csrf => {
      let csrftoken : string = null;
      if (csrf.hasOwnProperty('CSRF_TOKEN')) {

        csrftoken = csrf.CSRF_TOKEN;
      }
      this.getUserInfo(csrftoken);
    
    },
      error => {
          alert("Cannot retrieve CSRF token.");
          return;
    })


  }
}
