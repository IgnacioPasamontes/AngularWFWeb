import { Component, OnInit, ElementRef, ViewContainerRef, ViewChild, AfterViewInit, Inject, NgZone, ComponentRef, ComponentFactoryResolver} from '@angular/core';
import { IModalDialog, IModalDialogOptions, IModalDialogButton } from 'ngx-modal-dialog';
import { Globals } from '../globals';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { NodeInfoService } from './node-info.service';
import * as ClassicEditor from '../../assets/js/ckeditor5/ckeditor.js';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Node1ProblemFormulationComponent } from '../node1-problem-formulation/node1-problem-formulation.component';
import { environment } from '../../environments/environment';

import MicroModal from 'micromodal';


//declare let jQuery: any;
//declare let $: any;
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
  inline_output = false;
  show_inline = false;
  ckeditor_id: string;
  public Editor_config: Object;
  public Editor_config_copy: Object;
  environment = environment;
  micromodal = MicroModal;
  part = 0;

  dtOptions: DataTables.Settings = {};
  public Editor = ClassicEditor;
  dtTrigger: Subject<any> = new Subject();
  dataSource:any;
  
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(Node1ProblemFormulationComponent,{ static: false }) node1: Node1ProblemFormulationComponent;
  displayedColumns: string[];
  columnsToDisplay: string[];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering



  
  constructor(private el: ElementRef, public globals: Globals,
              public dialog: MatDialog,
              public ngZone: NgZone,
              @Inject(NodeInfoService) public service,
              public dialogRef: MatDialogRef<NodeInfoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Array<any>,
              ) {  }



  ngOnInit() {
    this.micromodal.init();
    this.info = this.data;
    this.ckeditor_id = 'ckeditor_'+this.info.project+'_'+this.info.node_seq+'_ouputs_comments';
    
    this.Editor_config = {
      toolbar:['heading','bold','italic','link','bulletedList','numberedList',
                'blockQuote','insertTable','undo','redo','custom-element-insert-molecule','custom-element-upload-table'],
      removePlugins: ['ImageToolbar','oEmbed'],
      CustomElement: {
        items:[
          {
            tag: 'image',
            placeholder: undefined, 
            attributes:{src: '', alt: 'C1CCCCC1' },
            toolname: 'insert-molecule',
            label: 'Add molecule', 
            inline: false,
            editable: false,
            component: this,
            exec_function: (component: any, custom_elem_command: any, create_element_func: any, url: string, editor_elem: any, smiles: string) => {
              alert(url);
              
            }
          },
          {
            tag: 'table',
            placeholder: undefined, 
            attributes:{src: '', alt: 'C1CCCCC1' },
            toolname: 'upload-table',
            label: 'Add table from CSV', 
            inline: false,
            editable: false,
            component: this,
            exec_function: (component: any, custom_elem_command: any, create_element_func: any, url: string, editor_elem: any, smiles: string) => {
              alert(url);
              
            }
          }
        ]
      }
    };

    //deep copy
    this.Editor_config_copy = $.extend(true,{},this.Editor_config);
    



    if (this.info.inputs_comments == undefined) {this.info.inputs_comments = ''};
    if (this.info.outputs_comments == undefined) {this.info.outputs_comments = ''};

    this.dataSource = new MatTableDataSource(this.data['outputs']);

    this.displayedColumns = Object.keys(this.data['outputs'][0]);
    this.columnsToDisplay = this.displayedColumns.slice();
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.savecomment = true;
    this.savecontent = true;
    
  }

  NodeCompleted() {
    const project_id = this.info.project;
    const node_seq = this.info.node_seq;
    this.service.setNodeAsBusy(project_id,project_id);
    this.service.setNodeAsBusy(project_id,node_seq,false);

    this.service.saveNode (this.info.project, this.info.node_seq, this.info.outputs,this.info.outputs_comments,this.globals.node_csrf_token[project_id][node_seq]).subscribe(
      result => {
        this.service.setNodeAsBusy(project_id,node_seq,false);
        this.globals.change =  !this.globals.change;
      }
    );
    switch(node_seq) { 
      case 1: {
        this.service.setNodeAsBusy(project_id,node_seq);
        this.node1.NodeCompleted();
        break; 
      } 
      default: { 
        //statements; 
        break; 
      } 
   } 

    
    this.inline_output = true;
    this.inline_comments = true;

    return false;
  }

  NodeEdit() {
    this.inline_output = false;
    this.inline_comments = false;
    return false;
  }

  onNoClick(): void {
    alert("Eeeeee");
    this.dialogRef.close();
  }

  addColumn() {
    const randomColumn = Math.floor(Math.random() * this.displayedColumns.length);
    this.columnsToDisplay.push(this.displayedColumns[randomColumn]);
  }

  removeColumn() {
    if (this.columnsToDisplay.length) {
      this.columnsToDisplay.pop();
    }
  }

  shuffle() {
    let currentIndex = this.columnsToDisplay.length;
    while (0 !== currentIndex) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // Swap
      let temp = this.columnsToDisplay[currentIndex];
      this.columnsToDisplay[currentIndex] = this.columnsToDisplay[randomIndex];
      this.columnsToDisplay[randomIndex] = temp;
    }
  }

}
