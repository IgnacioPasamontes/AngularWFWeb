import { Component, OnInit, Input, OnChanges, AfterViewInit } from '@angular/core';
import { ReportService } from './report.service';
import { Globals } from '../globals';
import { CkEditor } from '../ckeditor';
//import * as ClassicEditor from '../../assets/js/ckeditor5/ckeditor.js';
import { EachWorkflowService } from '../each-workflow/each-workflow.service';

declare let SmilesDrawer: any;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, OnChanges, AfterViewInit {


  @Input() projectName;
  @Input() change;
  @Input() tabChange;

  public project_number: number;
  public test: string;
  public report_sections: Object[] = [];
  public Editor_config: Object;
  public add_molecule_icon: string;
  public compounds_image_data: Object = {};
  public canvas_id: string = "tmp_compound_report_canvas";
  public parent_canvas_id: string = "tmp_compound_report_canvas_parent";
  public smiles_drawer_size: number = 200;
  public datamatrix_single_headers = ['Property','Value','Units','Description','Assay type','Assay ID']
  public datamatrix_single_fields = ['name', 'std_value', 'std_unit','description', 'assay_type','assay_id']
  public Editor: any; 

  constructor(private service: ReportService,
    public globals: Globals, public ckeditor: CkEditor,
    private eachworkflowservice: EachWorkflowService) { }

  ngOnInit() {
    // this.ckeditor_id_comments = 'ckeditor_'+this.info.project+'_'+this.info.node_seq+'_outputs_comments';
    /*'custom-element-upload-table'*/
    this.Editor = this.ckeditor.InlineEditor;
    const add_molecule_icon_path = this.globals.add_molecule_icon_path;
    const subs = this.eachworkflowservice.getAssetFileAsText(add_molecule_icon_path).subscribe(
      result_file_text => {
        this.add_molecule_icon = result_file_text;
        this.Editor_config = {
          toolbar:[],
          removePlugins: ['oEmbed'],
          CustomElement: {
            items:[
              { 
                ckeditor_id: '',
                icon: this.add_molecule_icon,
                tag: 'image',
                placeholder: undefined, 
                attributes:{src: '', alt: 'C1CCCCC1', 'molecule-smiles' : 'test'},
                toolname: 'insert-molecule',
                label: 'Add molecule', 
                inline: false,
                editable: false,
                component: {},
                exec_function: (component: any, custom_elem_command: any, create_element_func: any, url: string, editor_elem: any, smiles: string) => {
                  alert(url);
                  
                }
              },
              {
                ckeditor_id: '',
                tag: 'table',
                placeholder: undefined, 
                attributes:{src: '', alt: 'C1CCCCC1' },
                toolname: 'upload-table',
                label: 'Add table from CSV', 
                inline: false,
                editable: false,
                component: {},
                exec_function: (component: any, custom_elem_command: any, create_element_func: any, url: string, editor_elem: any, smiles: string) => {
                  alert(url);
                  
                }
              }
            ]
          }
        };

        //deep copy
        // this.Editor_config_copy = $.extend(true,{},this.Editor_config);
        // this.Editor_config_outputs = $.extend(true,{},this.Editor_config);
        // this.Editor_config_comments = $.extend(true,{},this.Editor_config);

        // let i = 0;
        // this.Editor_config_outputs['CustomElement'].items.forEach( (item) => {
        //   this.Editor_config_outputs['CustomElement'].items[i].ckeditor_id = this.ckeditor_id_outputs;
        //   i++;
        // });
        // i = 0;
        // this.Editor_config_comments['CustomElement'].items.forEach( (item) => {
        //   this.Editor_config_comments['CustomElement'].items[i].ckeditor_id = this.ckeditor_id_comments;
        //   i++;
        // });

    },
    error => {
      alert('Error: file "/assets/'+add_molecule_icon_path+'" not found.');
      subs.unsubscribe();
    },
    () => {
      subs.unsubscribe();
    });
  }

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('projectName')  || changes.hasOwnProperty('change')) {
      this.project_number = this.globals.current_user.projects[this.projectName];
      if (typeof this.project_number === 'undefined') { return; }
      const subs = this.service.getReport(this.project_number).subscribe(
        result => {
          this.report_sections = result['sections'];
          this.reportSectionsInternalId(this.report_sections);
          this.processCompoundSections(this.report_sections);
        },
        error => {
  
            alert('Error getting report data.');
            this.report_sections = [];
            subs.unsubscribe();
        },
        () => {
          subs.unsubscribe();
        }
      );
    } else if (changes.hasOwnProperty('tabChange')) {
      this.processCompoundSections(this.report_sections);
    }

  }

  ngAfterViewInit() {
    this.processCompoundSections(this.report_sections);
    
  }
  processCompoundSections(sections: Object[]){

    sections.forEach(section => {
      if(section['type'] === 'compound') {
        const compounds = section['data'][section['field']];
        this.compounds_image_data[section['int_id']] = [];
        this.drawCompounds(compounds, this.compounds_image_data[section['int_id']]);
      }
      this._processCompoundSections(section,section['subsections']);
    });
  }

  _processCompoundSections(section: Object,subsections: Object[]){
    subsections.forEach(subsection => {
      if(subsection['type'] === 'compound') {
        const compounds = section['data'][subsection['field']];
        this.compounds_image_data[subsection['int_id']] = [];
        this.drawCompounds(compounds, this.compounds_image_data[subsection['int_id']]);
      }
      this._processCompoundSections(section,subsection['subsections']);
    });
  }

  generateMoleculeImage(smiles: string) {
    const canvas_id = this.canvas_id;
    const canvas_id_2 = canvas_id+'_2';
    const smiles_drawer_size = this.smiles_drawer_size;
    const $canvas_elem_const = $('<canvas id="'+canvas_id+'">');
    const $canvas_elem_const2 = $('<canvas id="'+canvas_id_2+'">');
    let $elem = $('#' + this.parent_canvas_id);
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

  reportSectionsInternalId(report_sections,prefix='') {
    const current_prefix = prefix;
    let i: number = 1;
    if (typeof report_sections !== 'undefined' && report_sections !== null) {
      report_sections.forEach(section => {
        const int_id: string = current_prefix + i.toString()
        section['int_id'] = int_id;
        i++;
        this.reportSectionsInternalId(section.subsections,prefix=int_id+'_')
      });
    }
  }

  drawCompounds(compounds: Object[], output: string[]) {
    setTimeout(() => {
      compounds.forEach(compound => {

        output.push(this.generateMoleculeImage(compound['smiles']));
      });
    },0);

  }

  typeof(variable) {
    return typeof variable;
  }

  object_keys(obj) {
    return Object.keys(obj);
  }

  headerFirstAndSort(first_header: string, headers: string[]) {
    const headers2 = headers.slice();
    headers2.splice(headers.indexOf(first_header),1);
    headers2.sort();
    headers2.unshift(first_header);
    return headers2;
  }

  sortByName(array: Object[]) {
    const array2 = array.slice();
    array2.sort((a,b) => {
      if (a['name'] === b['name']) {
        return 0;
      } else if (a['name'] < b['name']) {
        return 1;
      } else {
        return -1;
      }
    });
    return array2;
  }

}
