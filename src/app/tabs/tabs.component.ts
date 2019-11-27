import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { NodeInfoService } from '../node-info/node-info.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {


  constructor( public globals: Globals, 
              private node : NodeInfoService,) { }
  


  objectKeys = Object.keys;

  ngOnInit() {

  }

  deleteProject(project) {
    const index = this.globals.active_projects.indexOf(project, 0);
    if (index > -1) {
      this.globals.active_projects.splice(index, 1);
    }
    this.globals.active_projects = [].concat(this.globals.active_projects);
    this.globals.visible_project = this.globals.active_projects[0];
    this.node.freeBusyProject(this.globals.projects[project]);

  }

  openProject(project: string) {

    if (this.globals.active_projects.indexOf(project, 0) === -1) {
      this.globals.active_projects.push(project);
      this.globals.visible_project = project;
    }
  }
  visibleProject(project:string){
    this.globals.visible_project = project;

  }
 }
