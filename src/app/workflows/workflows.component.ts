import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Globals } from '../globals';
import { environment } from '../../environments/environment';
import { Compound, CompoundService } from '../compound/compound.service';
import { WorkflowsService } from './workflows.service';
import { AsyncSubject } from 'rxjs';

declare var RegExpEscape: any;
declare let SmilesDrawer: any;

@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.css']
})
export class WorkflowsComponent implements OnInit, OnChanges {

  redraw_workflow: boolean = false;
  resize_redraw: boolean = false;
  subproject_suffix_separator_pattern: RegExp;
  @Input() redraw: boolean;
  @Input() workflow_resize_start: boolean;
  @Input() workflow_resize_update: boolean;
  smiles_drawer_size:number = 200
  public canvas_id: string = 'tmp_canvas_generate_report_docx';
  public canvas_id_parent: string = 'tmp_canvas_generate_report_docx_parent'; 

  
  constructor(private service: WorkflowsService,
    public globals: Globals,
    private compound_service: CompoundService) { }

  ngOnInit() {
    this.subproject_suffix_separator_pattern = new RegExp('^.*'+RegExpEscape(this.globals.subproject_suffix_separator));

  }


  triggerWorkflowRedraw() {
    this.redraw_workflow = !this.redraw_workflow;
    this.globals.workflow_scroll = !this.globals.workflow_scroll;
  }

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('redraw')) {
      this.resize_redraw = !this.resize_redraw;
    }
  }
  downloadReport() {
    const project_number: number = this.globals.current_user.projects[this.globals.current_main_project];
    const subj_tc = this.compound_service.getCompounds(project_number,Compound.TARGET_COMPOUND);
    const subj_sc = this.compound_service.getCompounds(project_number,Compound.SOURCE_COMPOUND);
    let once_tc: boolean = false;
    let once_sc: boolean = false;
    const subs_tc = subj_tc.subscribe(compounds_tc => {
      if (typeof compounds_tc === 'undefined' && !once_tc) {
        once_tc = true;
        console.log('once_tc');
        return;
      } else if (typeof compounds_tc === 'undefined' && once_tc) {
        compounds_tc = [];
      }
      const subs_sc = subj_sc.subscribe(compounds_sc => {
        if (typeof compounds_sc === 'undefined' && !once_sc) {
          once_tc = true;
          console.log('once_sc');
          return;
        } else if (typeof compounds_sc === 'undefined' && once_sc) {
          compounds_sc = [];
        }

        const compounds = compounds_tc.concat(compounds_sc);
        const compound_number: number = compounds.length; 
        const compounds_list: Compound[] = [];
        const images_list: string[] = [];

        compounds.forEach(compound => {
          const img_data = this.generateMoleculeImage(compound.smiles);
          compounds_list.push(compound);
          images_list.push(img_data);
        });
        if (compound_number > 0) {
          const subs2 = this.service.saveCompoundImage(project_number,compounds_list,images_list).subscribe(result => {
            const url: string = environment.baseUrl + 'project/'+project_number.toString()+'/report/docx';
            return window.location.href = url;

          },
          error => {
            alert("Error saving report compound images.");
            subs2.unsubscribe();
          },
          () => {
            subs2.unsubscribe();
          });
        }
        subj_sc.complete();


      },
      error => {
        alert("Error getting compound");
        subj_tc.complete();
        subs_sc.unsubscribe();
      },
      () => {
        subj_tc.complete();
        subs_sc.unsubscribe();
      });  
    },
    error => {
      alert("Error getting compound");
      subs_tc.unsubscribe();
    },
    () => {
      subs_tc.unsubscribe();
    });

  }

  generateMoleculeImage(smiles: string) {
    const canvas_id = this.canvas_id;
    const canvas_id_2 = canvas_id+'_2';
    const smiles_drawer_size = this.smiles_drawer_size;
    const $canvas_elem_const = $('<canvas id="'+canvas_id+'">');
    const $canvas_elem_const2 = $('<canvas id="'+canvas_id_2+'">');
    let $elem = $('#' + this.canvas_id_parent);
    $elem.append($canvas_elem_const);
    $elem.append($canvas_elem_const2);
    const canvas_elem: any = $elem.children("#"+canvas_id)[0];
    const canvas_elem2: any = $elem.children("#"+canvas_id_2)[0];


    //draw molecules
    const options = {width: smiles_drawer_size, height: smiles_drawer_size};
    const smilesDrawer = new SmilesDrawer.Drawer(options);
    //const smiles = 'C1CCCCC1';
    SmilesDrawer.parse(smiles, function(tree) {
      smilesDrawer.draw(tree, canvas_id, 'light', false);
    });
    
    const ctx = canvas_elem2.getContext('2d');
    ctx.canvas.width = canvas_elem.width;
    ctx.canvas.height = canvas_elem.height;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0,  canvas_elem.width, canvas_elem.height);
    ctx.drawImage(canvas_elem, 0, 0);

    const data = canvas_elem2.toDataURL();
    $(canvas_elem).remove();
    $(canvas_elem2).remove();
    return data;
  }
}
