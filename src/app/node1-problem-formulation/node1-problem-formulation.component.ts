import { Component, Input, Output, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Node1ProblemFormulationService } from './node1-problem-formulation.service';
import { Globals } from '../globals';
import { NodeInfoService } from '../node-info/node-info.service';

@Component({
  selector: 'app-node1-problem-formulation',
  templateUrl: './node1-problem-formulation.component.html',
  styleUrls: ['./node1-problem-formulation.component.css']
})
export class Node1ProblemFormulationComponent implements OnInit {
  @Input() info;
  @Output() problem_description : string;
  inline_problem_description = false;
  show_inline = false;

  public Editor = ClassicEditor;

  constructor(private service: Node1ProblemFormulationService,
              public globals: Globals,
              private node: NodeInfoService) { }

  ngOnInit() {
    this.problem_description = this.info.inputs_comments;
  }

  NodeCompleted( project_id: number) {
    const node_id = 1;
    this.service.saveNode (this.info.project, this.problem_description,this.globals.node_csrf_token[project_id][node_id]).subscribe(
      result => {
        this.globals.change =  !this.globals.change;
        this.node.setNodeAsBusy(project_id,node_id,false);
      }
    );
     
    this.inline_problem_description = true;
    

    return false;
  }

}
