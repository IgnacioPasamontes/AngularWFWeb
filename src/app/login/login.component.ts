import { Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../globals';
import { LoginService } from './login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})



export class LoginComponent implements OnInit, OnDestroy {

  user: string;
  user_password: string;
  rememberme = false;
  success = false;
  error = false;
  private getuser_subscription: Subscription;


  @ViewChild('tmpdiv', {static: true}) tmpdiv: ElementRef;


  constructor(private router: Router, public globals: Globals,
              private service: LoginService) { }

  ngOnInit() {

  }

  getUserInfo (csrftoken: string) {
    const resume = false;
    this.getuser_subscription = this.service.getUser(this.user,this.user_password, csrftoken, resume, this.rememberme).subscribe(
      result => {
        this.service.setActualUserGlobals(result);
        this.router.navigate(['main']);
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
    this.success = false;
    this.service.getUserCSRFToken().subscribe(csrf => {
      let csrftoken: string = null;
      if (csrf.hasOwnProperty('CSRF_TOKEN')) {

        csrftoken = csrf.CSRF_TOKEN;
      }
      this.getUserInfo(csrftoken);

    },
      () => {
          alert('Cannot retrieve CSRF token.');
          return;
    });


  }

  ngOnDestroy() {
    this.getuser_subscription.unsubscribe();

  }
}
