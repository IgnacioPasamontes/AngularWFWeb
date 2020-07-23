import { Injectable } from '@angular/core';

import { Globals } from '../globals';
import { NodeInfoService } from '../node-info/node-info.service';

declare var $: any;
declare var RegExpEscape: any;

@Injectable({
  providedIn: 'root'
})
export class TabsService {

  

  constructor(public globals: Globals,
    private node : NodeInfoService,) { }



  getMainProjectName(project: string) {
    //remove final TD ot TK
    let subproject_type = null;
    let mainproject = project;
    if (project === null || typeof project === 'undefined') {
      return {project: mainproject, subproject_type: null};
    }
    const no_td_project = project.replace(new RegExp(this.globals.td_project_suffix+'$'),'');
    if (project === no_td_project) {
      const no_tk_project = project.replace(new RegExp(this.globals.tk_project_suffix+'$'),'');
      if (no_tk_project !==  project) {
        subproject_type = 'TK';
        mainproject = no_td_project
      }
    } else {
      subproject_type = 'TD';
      mainproject = no_td_project;
    }
    return {project: mainproject, subproject_type: subproject_type};
  }

  deleteProject(project: string) {
    
    const index = this.globals.active_projects.indexOf(project, 0);
    if (index > -1) {
      this.globals.active_projects.splice(index, 1);
    }
    this.globals.active_projects = [].concat(this.globals.active_projects);
    this.globals.previous_visible_project = this.globals.visible_project;
    this.globals.visible_project = this.globals.active_projects[0];
    this.updateConnections();

    const obj = this.getMainProjectName(project);
    this.node.freeBusyProject(this.globals.current_user.projects[obj.project], obj.subproject_type);
    this.globals.current_main_project = this.getMainProjectName(this.globals.visible_project).project;

  }

  openProject(project: string) {

    if (this.globals.active_projects.indexOf(project, 0) === -1) {
      this.globals.active_projects.push(project);      
    }
    this.globals.previous_visible_project = this.globals.visible_project;
    this.globals.visible_project = project;
    this.globals.current_main_project = this.getMainProjectName(this.globals.visible_project).project;
    this.updateConnections();
  }



  getClassName(project_name: string) {

    let tk_class_name = project_name.replace(
      new RegExp(RegExpEscape(this.globals.tk_project_suffix)+'$'),
      this.globals.tk_class_suffix
    )

    let td_class_name = project_name.replace(
      new RegExp(RegExpEscape(this.globals.td_project_suffix)+'$'),
      this.globals.td_class_suffix
    )


    let class_name = project_name;
    if (tk_class_name !== class_name) {
      class_name = tk_class_name;
    } else if (td_class_name !== class_name) {
      class_name = td_class_name;
    }

    return class_name;
  }

  updateConnections() {
    const previous_proj = this.globals.previous_visible_project;
    const current_proj = this.globals.visible_project;

    let prev_class_name: string = undefined;
    let class_name: string = undefined;


    if (typeof previous_proj !== 'undefined' && previous_proj !== null  && previous_proj !== '') {
      prev_class_name = this.getClassName(this.globals.previous_visible_project);
    }
    if (typeof current_proj !== 'undefined' && current_proj !== null  && current_proj !== '') {
      class_name = this.getClassName(this.globals.visible_project);
    }
    
    setTimeout(function(prev_class_name,class_name) {

        if(typeof prev_class_name !== 'undefined') {
          $('.' + prev_class_name).connections('update');
        }
        if(typeof class_name !== 'undefined') {
          $('.' + class_name).connections('update');
        }
    }.bind(this,prev_class_name,class_name), 0);
  }



}

