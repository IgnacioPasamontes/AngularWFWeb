import { Component, Input, Output, OnInit } from '@angular/core';
import { Node1ProblemFormulationService } from './node1-problem-formulation.service';
import { ProblemFormulation } from './node1-problem-formulation.service';
import { Globals } from '../globals';
import { CkEditor } from '../ckeditor';
import { NodeInfoService } from '../node-info/node-info.service';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';

//import * as ClassicEditor from '../../assets/js/ckeditor5/ckeditor.js';
import MicroModal from 'micromodal';

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
  smiles_drawer_size : number = 200;
  data: any;
  environment = environment;
  micromodal = MicroModal;
  ckeditor_id_base: string;
  ckeditor_ids: Object = {};
  ckeditors: Object = {};
  part = 1;
  problem_formulation: ProblemFormulation = new ProblemFormulation();

  public Editor: any;

  constructor(private service: Node1ProblemFormulationService,
              public globals: Globals, private ckeditor: CkEditor,
              private node: NodeInfoService) { }

  ngOnInit() {
    this.Editor = this.ckeditor.ClassicEditor;
    this.data = this.info;
    this.micromodal.init();
    this.ckeditor_id_base = 'ckeditor_'+this.info.project+'_'+this.info.node_seq+'_problem_formulation';
    let editor_config: any; 
    Object.getOwnPropertyNames(this.problem_formulation).forEach(field => {
      const ckeditor_id = this.ckeditor_id_base+'-'+field;
      this.ckeditor_ids[field] = ckeditor_id;
      editor_config = $.extend(true,{},this.Editor_config);
      let i = 0;
      editor_config.CustomElement.items.forEach( (item) => {
        editor_config.CustomElement.items[i].ckeditor_id = ckeditor_id;
        editor_config.CustomElement.items[i].component = {
          smiles_drawer_size: this.smiles_drawer_size,
          micromodal: this.micromodal,
          environment: this.environment,
          data: this.data,
        };
        i++;
      });
      this.ckeditors[field] = editor_config;
    });

    this.service.getProblemDescription(this.info.project).subscribe(
      result => {
        Object.getOwnPropertyNames(this.problem_formulation).forEach(field => {
          if (result[field] === null || typeof result[field] === 'undefined') {
            this.problem_formulation[field] = '';
          } else {
            this.problem_formulation[field] = result[field];
          }
          
        });
        
      },
      error => {
        if (error.status === 404) {
          this.problem_formulation = new ProblemFormulation();
        } else {
          alert('Error getting problem description');
        }
      }
    );

    
  }

  NodeCompleted() {
    const project_id = this.info.project;
    const node_seq = 1;
    this.service.saveNode (project_id, this.problem_formulation,this.globals.node_csrf_token[project_id][node_seq]).subscribe(
      result => {
        this.globals.change =  !this.globals.change;
        // this.node.setNodeAsBusy(project_id,node_seq,false);
      }
    );
     
    this.inline_problem_description = true;
    

    return false;
  }

}
