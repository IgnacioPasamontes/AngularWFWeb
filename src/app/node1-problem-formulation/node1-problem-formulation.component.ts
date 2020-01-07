import { Component, Input, Output, OnInit } from '@angular/core';
import { Node1ProblemFormulationService } from './node1-problem-formulation.service';
import { Globals } from '../globals';
import { NodeInfoService } from '../node-info/node-info.service';
import { environment } from '../../environments/environment';

//import * as ClassicEditor from '../../assets/js/ckeditor5/ckeditor.js';
import MicroModal from 'micromodal';

@Component({
  selector: 'app-node1-problem-formulation',
  templateUrl: './node1-problem-formulation.component.html',
  styleUrls: ['./node1-problem-formulation.component.css']
})
export class Node1ProblemFormulationComponent implements OnInit {
  @Input() info;
  @Input() Editor;
  @Input() Editor_config;
  @Output() problem_description : string;
  inline_problem_description = false;
  show_inline = false;

  data: any;
  environment = environment;
  micromodal = MicroModal;
  ckeditor_id: string;
  part = 1;

  //public Editor = ClassicEditor;

  constructor(private service: Node1ProblemFormulationService,
              public globals: Globals,
              private node: NodeInfoService) { }

  ngOnInit() {
    this.data = this.info;
    this.micromodal.init();
    this.ckeditor_id = 'ckeditor_'+this.info.project+'_'+this.info.node_seq+'_problem_formulation';
    let i = 0;
    this.Editor_config.CustomElement.items.forEach( (item) => {
      this.Editor_config.CustomElement.items[i].component = this;
      i++;
    });

    

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
