import { Component, OnInit, ElementRef, ViewContainerRef, ViewChild, AfterViewInit, Inject, NgZone, ComponentRef, ComponentFactoryResolver} from '@angular/core';
import { IModalDialog, IModalDialogOptions, IModalDialogButton } from 'ngx-modal-dialog';
import { Globals } from '../globals';
import { Subject } from 'rxjs';
import { NodeInfoService } from './node-info.service';
import { CkEditor } from '../ckeditor';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Node1ProblemFormulationComponent } from '../node1-problem-formulation/node1-problem-formulation.component';
import { Node4InitialRaxHypothesisComponent } from '../node4-initial-rax-hypothesis/node4-initial-rax-hypothesis.component';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';
import { ResizeSensor } from 'css-element-queries';


import MicroModal from 'micromodal';
import { TcCharacterizationService } from '../tc-characterization/tc-characterization.service';


//declare let jQuery: any;
//declare let $: any;
declare var require: any;
declare let SmilesDrawer: any;

@Component({
  selector: 'app-node-info',
  templateUrl: './node-info.component.html',
  styleUrls: ['./node-info.component.css']
})
export class NodeInfoComponent implements OnInit, AfterViewInit {

  info:any;
  inline_comments = false;
  savecomment = false;
  savecontent = false;
  inline_input = false;
  inline_output = false;
  show_inline = false;
  ckeditor_id_outputs: string;
  ckeditor_id_comments: string;
  public Editor_config: Object;
  public Editor_config_copy: Object;
  public Editor_config_outputs: Object;
  public Editor_config_comments: Object;
  smiles_drawer_size : number = 200;
  environment = environment;
  micromodal = MicroModal;
  part = 0;
  sub: Subscription;


  public Editor: any;  
  
  @ViewChild(Node1ProblemFormulationComponent,{ static: false }) node1: Node1ProblemFormulationComponent;
  @ViewChild(  Node4InitialRaxHypothesisComponent,{ static: false }) node4: Node1ProblemFormulationComponent;
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering



  
  constructor(private el: ElementRef, public globals: Globals, public ckeditor: CkEditor,
              @Inject(NodeInfoService) public service,
              public dialogRef: MatDialogRef<NodeInfoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Array<any>,
              ) {  }



  ngOnInit() {
    this.Editor = this.ckeditor.ClassicEditor;
    this.micromodal.init();
    this.info = this.data;

    this.ckeditor_id_outputs = 'ckeditor_'+this.info.project+'_'+this.info.node_seq+'_outputs';
    this.ckeditor_id_comments = 'ckeditor_'+this.info.project+'_'+this.info.node_seq+'_outputs_comments';
    /*'custom-element-upload-table'*/
    this.Editor_config = {
      toolbar:['heading','bold','italic','link','bulletedList','numberedList',
                'blockQuote','insertTable','undo','redo','custom-element-insert-molecule','|',],
      removePlugins: ['oEmbed'],
      CustomElement: {
        items:[
          { 
            ckeditor_id: '',
            icon: this.data['add_molecule_icon'],
            tag: 'image',
            placeholder: undefined, 
            attributes:{src: '', alt: 'C1CCCCC1', 'molecule-smiles' : 'test'},
            toolname: 'insert-molecule',
            label: 'Add molecule', 
            inline: false,
            editable: false,
            component: {
              smiles_drawer_size: this.smiles_drawer_size,
              micromodal: this.micromodal,
              environment: this.environment,
              data: this.info,
            },
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
            component: {
              smiles_drawer_size: this.smiles_drawer_size,
              micromodal: this.micromodal,
              environment: this.environment,
              data: this.info,
            },
            exec_function: (component: any, custom_elem_command: any, create_element_func: any, url: string, editor_elem: any, smiles: string) => {
              alert(url);
              
            }
          }
        ]
      }
    };

    //deep copy
    this.Editor_config_copy = $.extend(true,{},this.Editor_config);
    this.Editor_config_outputs = $.extend(true,{},this.Editor_config);
    this.Editor_config_comments = $.extend(true,{},this.Editor_config);

    let i = 0;
    this.Editor_config_outputs['CustomElement'].items.forEach( (item) => {
      this.Editor_config_outputs['CustomElement'].items[i].ckeditor_id = this.ckeditor_id_outputs;
      i++;
    });
    i = 0;
    this.Editor_config_comments['CustomElement'].items.forEach( (item) => {
      this.Editor_config_comments['CustomElement'].items[i].ckeditor_id = this.ckeditor_id_comments;
      i++;
    });



    if (this.info.inputs_comments == undefined) {this.info.inputs_comments = ''};
    if (this.info.outputs_comments == undefined) {this.info.outputs_comments = ''};

  }

  ngAfterViewInit() {
    
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.savecomment = true;
    this.savecontent = true;
    




    const dialog_height = $('.mat-dialog-container').height();
    let style = $('<style id="style_ck-editor__editable">.ck-editor__editable { max-height: '+
      (dialog_height*0.80).toString()+'px }</style>');
    $('html > head').append(style);

    $(".mat-dialog-container").each(function(){
      let resize_sensor = new ResizeSensor(this, function () {
        const dialog_height = $('.mat-dialog-container').height();
        let style = $('#style_ck-editor__editable').html('.ck-editor__editable { max-height: '+
          (dialog_height*0.70).toString()+'px }');
        $('html > head').append(style);
      });
    });
    
  }

  NodeCompleted() {
    this.dialogRef.disableClose = true;
    const project_id = this.info.project;
    const node_seq = this.info.node_seq;
    this.service.setNodeAsBusy(project_id,node_seq,false);

    this.sub = this.service.saveNode(this.info.project, this.info.node_seq, this.info.inputs_comments,this.info.outputs,this.info.outputs_comments,this.globals.node_csrf_token[project_id][node_seq]).subscribe(
      result => {

        switch(node_seq) { 
          case 1: {
            this.service.setNodeAsBusy(project_id,node_seq);
            this.node1.NodeCompleted();
            break; 
          }
          case 4: {
            this.service.setNodeAsBusy(project_id,node_seq);
            this.node4.NodeCompleted();
            break; 
          } 
          default: {
            this.globals.change_datamatrix = !this.globals.change_datamatrix;
            //statements; 
            break; 
          } 
        }


        this.service.setNodeAsBusy(project_id,node_seq,false);
        this.globals.change =  !this.globals.change;
        this.dialogRef.disableClose = false;
        this.dialogRef.close('OK');
      },
      error => {},
      () => {
        this.sub.unsubscribe;
      }
    );
 

    this.inline_input = true;
    this.inline_output = true;
    this.inline_comments = true;


    return false;
  }

  NodeEdit() {
    this.inline_input = false;
    this.inline_output = false;
    this.inline_comments = false;
    return false;
  }
}
