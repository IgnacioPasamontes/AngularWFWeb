import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { Nodes } from '../nodes/nodes'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  projectsName:string ="New_Project"
  nodes:Array<any>;
  constructor( public globals: Globals) { }

  ngOnInit() {
    this.nodes=Nodes;
  }

  newProject(){

    let project = this.projectsName;
    let inserted = false;
    let num = 1;

    while (!inserted){

      if (this.globals.active_projects.indexOf(project, 0) === -1 &&
          this.globals.actual_user.projects.indexOf(project, 0) === -1 ) {
            this.globals.active_projects.push(project);
            this.globals.visible_project = project;
            inserted = true;
      }
      else{
        project = this.projectsName + '_' + num;
        num ++;
      }

    }
    

  }
}
