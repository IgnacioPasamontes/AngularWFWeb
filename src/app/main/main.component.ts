import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../globals';
import { LoginService } from '../login/login.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  private getuser_subscription: Subscription;
  private getprojects_subscription: Subscription;

  constructor(public globals: Globals,
              private login: LoginService,
              private router: Router) { }

  ngOnInit() {

    if(this.globals.current_user == undefined || this.globals.current_user.id == null) {
      this.getUserInfo();
    }
    this.getUserProjects();

    document.getElementById('sidebarCollapse').addEventListener('click', function () {
      document.getElementById('sidebar').classList.toggle('active');
    });
    document.getElementById('[rel=\'tooltip\']');
  }

  change() {
    this.globals.change = !this.globals.change;
  }

  getUserInfo(csrftoken?: string) {
    let username :string; // = undefined
    let password :string; //= undefined
    const resume : boolean = true;
    this.getuser_subscription = this.login.getUser(username,password,csrftoken,resume).subscribe(
        result => {
        if (result.id == null || !result.hasOwnProperty('id')) {
          this.router.navigate(['login']);
            return;
        }
        this.login.setCurrentUserGlobals(result);
        
      },
      error => {
          alert('Cannot connect to server.');

        
      }
    );
  }
  getUserProjects() {
    this.getprojects_subscription = this.login.getProjects().subscribe(
      result2 => {
        let projects: Object = {};
        for (const project of result2) {
          projects[project.name] = project.id;
        }
        this.globals.current_user.setProjects(projects);
      },
      error => {
        alert('Error getting user projects.');
        
      }
    );
  }

  ngOnDestroy() {
    if (typeof this.getuser_subscription != 'undefined') {
      this.getuser_subscription.unsubscribe();
    }
    if (typeof this.getprojects_subscription != 'undefined') {
      this.getprojects_subscription.unsubscribe();
    }

  }

}
