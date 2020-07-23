import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../globals';
import { LoginService } from '../login/login.service';
import { stringify } from 'querystring';
import { User } from '../user';
import { TabsService } from '../tabs/tabs.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  objectKeys = Object.keys;

  constructor(public globals: Globals,
     private loginService: LoginService,
     private router: Router,
     private tabs: TabsService) { }

  ngOnInit() {
  }

  swapProject(from_project: string, to_project: string) {

    let main_from_project: string;

    if (typeof from_project !== 'undefined' && from_project !== null  && from_project !== '') {
        main_from_project = from_project.replace(
        new RegExp(this.globals.subproject_suffix_separator+'.*$'),
        ''
        )
      if (main_from_project !== to_project) {
      
        this.tabs.deleteProject(main_from_project);
        const tk_project = main_from_project+this.globals.tk_project_suffix;

        if (this.globals.active_projects.indexOf(tk_project, 0) > -1) {
          this.tabs.deleteProject(tk_project);
        }
        const td_project = main_from_project+this.globals.td_project_suffix;
        if (this.globals.active_projects.indexOf(td_project, 0) > -1) {
          this.tabs.deleteProject(td_project);
        }
      }
    }
    if (typeof to_project !== 'undefined' && to_project !== null && to_project !== '') {
      this.tabs.openProject(to_project);
      if (main_from_project === to_project) {
        const index = this.globals.active_projects.indexOf(main_from_project,0);
        if ( index !== 0) {
          const last_active_project = this.globals.active_projects.splice(index,index)[0];
          this.globals.active_projects.splice(0,0,last_active_project);
        } 

      }
    }
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
