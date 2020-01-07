import { Component, Input, Output, OnInit } from '@angular/core';
import { Node1ProblemFormulationService } from './node1-problem-formulation.service';
import { Globals } from '../globals';
import { NodeInfoService } from '../node-info/node-info.service';

import * as ClassicEditor from '../../assets/js/ckeditor5/ckeditor.js';

@Component({
  selector: 'app-node1-problem-formulation',
  templateUrl: './node1-problem-formulation.component.html',
  styleUrls: ['./node1-problem-formulation.component.css']
})
export class Node1ProblemFormulationComponent implements OnInit {
  @Input() info;
  @Input() Editor_config;
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

  NodeCompleted() {
    const project_id = this.info.project;
    const node_seq = 1;
    this.service.saveNode (project_id, this.problem_description,this.globals.node_csrf_token[project_id][node_seq]).subscribe(
      result => {
        this.globals.change =  !this.globals.change;
        this.node.setNodeAsBusy(project_id,node_seq,false);
      }
    );
     
    this.inline_problem_description = true;
    

    return false;
  }

}
