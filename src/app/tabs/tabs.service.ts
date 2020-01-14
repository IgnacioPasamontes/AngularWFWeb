import { Injectable } from '@angular/core';

import { Globals } from '../globals';
import { NodeInfoService } from '../node-info/node-info.service';


@Injectable({
  providedIn: 'root'
})
export class TabsService {

  

  constructor(public globals: Globals,
    private node : NodeInfoService,) { }


  deleteProject(project: string) {
    const index = this.globals.active_projects.indexOf(project, 0);
    if (index > -1) {
      this.globals.active_projects.splice(index, 1);
    }
    this.globals.active_projects = [].concat(this.globals.active_projects);
    this.globals.previous_visible_project = this.globals.visible_project;
    this.globals.visible_project = this.globals.active_projects[0];

    //remove final TD ot TK
    let subproject_type = null;
    const no_td_project = project.replace(new RegExp(this.globals.td_project_suffix+'$'),'');
    if (project === no_td_project) {
      const no_tk_project = project.replace(new RegExp(this.globals.tk_project_suffix+'$'),'');
      if (no_tk_project !==  project) {
        subproject_type = 'TK';
      }
    } else {
      subproject_type = 'TD';
      project = no_td_project;
    }
    this.node.freeBusyProject(this.globals.current_user.projects[project], subproject_type);

  }

  openProject(project: string) {

    if (this.globals.active_projects.indexOf(project, 0) === -1) {
      this.globals.active_projects.push(project);
      this.globals.previous_visible_project = this.globals.visible_project;
      this.globals.visible_project = project;
      
    } else {
      this.globals.visible_project = project;
    }
  }
}

