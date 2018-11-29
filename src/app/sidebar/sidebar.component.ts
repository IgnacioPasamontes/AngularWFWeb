import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { Nodes } from '../nodes/nodes'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  projectsName:string ="New Project"
  nodes:Array<any>;
  constructor( public globals: Globals) { }

  ngOnInit() {
    this.nodes=Nodes;
  }

  newProject(){
    
    var project =this.projectsName;
    var inserted:boolean=false
    var num:number=1

    while (!inserted){

      if (this.globals.active_projects.indexOf(project, 0)==-1 && 
          this.globals.actual_user.projects.indexOf(project, 0)==-1){
            this.globals.active_projects.push(project);
            inserted=true;
      }
      else{
        project=this.projectsName+" "+num;
        num++
      }

    }
    

  }
}
