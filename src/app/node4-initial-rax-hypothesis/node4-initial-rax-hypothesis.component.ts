import { Component, Input, Output, OnInit } from '@angular/core';
import { Node4InitialRaxHypothesisService } from './node4-initial-rax-hypothesis.service';
import { InitialRAxHypothesis } from './node4-initial-rax-hypothesis.service';
import { Globals } from '../globals';
import { NodeInfoService } from '../node-info/node-info.service';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';

import MicroModal from 'micromodal';

@Component({
  selector: 'app-node4-initial-rax-hypothesis',
  templateUrl: './node4-initial-rax-hypothesis.component.html',
  styleUrls: ['./node4-initial-rax-hypothesis.component.css']
})
export class Node4InitialRaxHypothesisComponent implements OnInit {

  @Input() info;
  @Input() Editor;
  @Input() Editor_config;
  @Output() initial_rax_hypothesis : string;
  inline_initial_rax_hypothesis = false;
  show_inline = false;
  smiles_drawer_size : number = 200;
  data: any;
  environment = environment;
  micromodal = MicroModal;
  ckeditor_id_base: string;
  ckeditor_ids: Object = {};
  ckeditors: Object = {};
  part = 1;
  initial_rax_hypothesis_data: InitialRAxHypothesis = new InitialRAxHypothesis(); 

  constructor(private service: Node4InitialRaxHypothesisService,
              public globals: Globals,
              private node: NodeInfoService) { }

    ngOnInit() {
      this.data = this.info;
      this.micromodal.init();
      this.ckeditor_id_base = 'ckeditor_'+this.info.project+'_'+this.info.node_seq+'_initial_rax_hypothesis';
      let editor_config: any;
      Object.getOwnPropertyNames(this.initial_rax_hypothesis_data).forEach(field => {
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
  
      this.service.getInitialRAxHypothesis(this.info.project).subscribe(
        result => {
          
          Object.getOwnPropertyNames(this.initial_rax_hypothesis_data).forEach(field => {
            const db_field: string = this.service.InitialRAxHypothesisClass2dbFields[field];
            if (result[db_field] === null || typeof result[db_field] === 'undefined') {
              this.initial_rax_hypothesis_data[field] = '';
            } else {
              this.initial_rax_hypothesis_data[field] = result[db_field];
            }
            
          });
        },
        error => {
          if (error.status === 404) {
            this.initial_rax_hypothesis_data = new InitialRAxHypothesis();
          } else {
            alert('Error getting problem description');
          }
        }
      );
  
      
    }
  
    NodeCompleted() {
      const project_id = this.info.project;
      const node_seq = 4;
      this.service.saveNode (project_id, this.initial_rax_hypothesis_data,this.globals.node_csrf_token[project_id][node_seq]).subscribe(
        result => {
          this.globals.change =  !this.globals.change;
          // this.node.setNodeAsBusy(project_id,node_seq,false);
        }
      );
        
      this.inline_initial_rax_hypothesis = true;
      
  
      return false;
    }

}
