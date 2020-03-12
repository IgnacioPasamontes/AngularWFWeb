import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { TabsService } from './tabs.service';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})

export class TabsComponent implements OnInit {


  constructor( public globals: Globals,
              private  service: TabsService) { }
  


  objectKeys = Object.keys;

  ngOnInit() {

  }

  deleteProject(project: string) {
    this.service.deleteProject(project);
  }

  openProject(project: string) {
    this.service.openProject(project);
  }

  swapProject(from_project: string, to_project: string) {

    let main_from_project: string;

    if (typeof from_project !== 'undefined' && from_project !== null  && from_project !== '') {
        main_from_project = from_project.replace(
        new RegExp(this.globals.subproject_suffix_separator+'.*$'),
        ''
        )
      if (main_from_project !== to_project) {
      
        this.deleteProject(main_from_project);
        const tk_project = main_from_project+this.globals.tk_project_suffix

        if (this.globals.active_projects.indexOf(tk_project, 0) > -1) {
          this.deleteProject(tk_project);
        }
        const td_project = main_from_project+this.globals.td_project_suffix
        if (this.globals.active_projects.indexOf(td_project, 0) > -1) {
          this.deleteProject(td_project);
        }
      }
    }
    if (typeof to_project !== 'undefined' && to_project !== null && to_project != '') {
      this.openProject(to_project);
      if (main_from_project === to_project) {
        const index = this.globals.active_projects.indexOf(main_from_project,0);
        if ( index !== 0) {
          const last_active_project = this.globals.active_projects.splice(index,index)[0];
          this.globals.active_projects.splice(0,0,last_active_project);
        } 

      }
    }
  }
  



  visibleProject(project:string){
    this.globals.previous_visible_project = this.globals.visible_project
    this.globals.visible_project = project;
    this.service.updateConnections();
  }
 }
