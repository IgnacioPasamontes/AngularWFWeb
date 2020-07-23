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


  visibleProject(project:string){
    this.globals.previous_visible_project = this.globals.visible_project
    this.globals.visible_project = project;
    this.service.updateConnections();
  }
 }
