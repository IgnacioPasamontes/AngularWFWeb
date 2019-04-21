import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { Globals } from '../globals';
import { LoginService } from './login.service';
import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: string;
  user_password: string;
  success = false;
  error = false;
  constructor(private router: Router, public globals: Globals,
              private service: LoginService) { }

  ngOnInit() {
  }

  login() {
    this.error = false;
    const newLocal = this.success = false;
    this.service.getUser(this.user).subscribe(
      result => {
        this.globals.actual_user = new User();
        this.globals.actual_user.id = result.id;
        this.globals.actual_user.name = result.user;
        this.globals.actual_user.mail = result.mail;
        this.globals.actual_user.projects = {};
        this.service.getProjects(this.globals.actual_user.id).subscribe(
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
            alert('Error getting model');
          }
        );
      },
      error => {
        alert('Error getting model');
      }
    );
  }
}
