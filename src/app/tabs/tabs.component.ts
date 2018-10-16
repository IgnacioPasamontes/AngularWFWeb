import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {


  constructor( public globals: Globals) { }

  ngOnInit() {

  }

  deleteProject(project:string) {

  alert(project)
    const index = this.globals.projects.indexOf(project, 0);
    alert(index)
    if (index > -1) {
      this.globals.projects.splice(index, 1);
    }
  }

}
