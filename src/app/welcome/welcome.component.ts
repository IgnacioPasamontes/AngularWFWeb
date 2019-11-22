import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../globals';
import { LoginService } from '../login/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, OnDestroy  {

  private session_check_subscription: Subscription;

  constructor(public globals: Globals,
              private login: LoginService,
              private router: Router) { }

  ngOnInit() {
    this.session_check_subscription = this.SessionCheck();

  }

  SessionCheck() {
    const username: string = undefined;
    const password: string = undefined;
    const resume: boolean = true;
    const csrftoken: string = undefined;
    return this.login.getUser(username,password,csrftoken,resume).subscribe(
      result => {
        if (result.id == null || !result.hasOwnProperty('id')) {
          this.router.navigate(['login']);
        } else {
          this.router.navigate(['main']);
        }

      },
      error => {
          alert('Cannot connect to server.');

        
      }
    );
  }

  ngOnDestroy() {
    this.session_check_subscription.unsubscribe();

  }

}
