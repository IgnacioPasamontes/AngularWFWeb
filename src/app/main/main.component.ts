import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../globals';
import { LoginService } from '../login/login.service';
import { Subscription } from 'rxjs';
import { TabsService } from '../tabs/tabs.service';
import { ResizeEvent } from 'angular-resizable-element';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {


  objectKeys = Object.keys;
  public style: object = {};
  public workflowStyleInit: object = {'overflow-x': 'auto', 'max-width': '90%'};
  public workflowStyle: object = {};
  public workflowRedraw: boolean = false;
  public datamatrixRedraw: boolean = false;
  public workflow_resize_start: boolean = false;
  public workflow_resize_update: boolean = false;
  private getuser_subscription: Subscription;
  private getprojects_subscription: Subscription;

  constructor(public globals: Globals,
              private login: LoginService,
              private router: Router,
              private tabs: TabsService) { }

  ngOnInit() {
    this.workflowStyle = this.workflowStyleInit;

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

  ngOnDestroy() {
    if (typeof this.getuser_subscription != 'undefined') {
      this.getuser_subscription.unsubscribe();
    }
    if (typeof this.getprojects_subscription != 'undefined') {
      this.getprojects_subscription.unsubscribe();
    }

  }

  onResizeStart(event: ResizeEvent): void {
    this.workflow_resize_start = !this.workflow_resize_start;

  }

  onResizeEnd(event: ResizeEvent): void {
    this.workflowStyle['width'] = `${event.rectangle.width}px`;
    this.datamatrixRedraw = !this.datamatrixRedraw;
    this.workflowRedraw = !this.workflowRedraw;
  }

  onResizing(event: ResizeEvent): void {
    this.workflow_resize_update = !this.workflow_resize_update;
  }
}
