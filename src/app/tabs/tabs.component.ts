import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {

  projectsName:string ="New Project"
  constructor( public globals: Globals) { }

  ngOnInit() {

  }

  deleteProject(project:string) {
    const index = this.globals.active_projects.indexOf(project, 0);
    if (index > -1) {
      this.globals.active_projects.splice(index, 1);
    }
  }

  openProject(project:string){
   
    if (this.globals.active_projects.indexOf(project, 0)==-1){
      this.globals.active_projects.push(project);
    }
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
