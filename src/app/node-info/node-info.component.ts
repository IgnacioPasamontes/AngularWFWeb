import { Component, OnInit, ElementRef, ComponentRef, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import { IModalDialog, IModalDialogOptions, IModalDialogButton } from 'ngx-modal-dialog';
import {Globals} from '../globals';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { KeyRegistry } from '@angular/core/src/di/reflective_key';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';



declare let jQuery: any;

@Component({
  selector: 'app-node-info',
  templateUrl: './node-info.component.html',
  styleUrls: ['./node-info.component.css']
})
export class NodeInfoComponent implements OnInit, IModalDialog {

  actionButtons: IModalDialogButton[];
  output:string = ''
  comments:string = ''
  input:Array<any> = []
  resources:Array<any> = []
  description:string;
  name:string;
  objectKeys = Object.keys;
  columnid:number = 1;
  columns:any;
  confirmed_columns:any;
  editInfoOut:Array<any>;
  nodeId:number;
  inline_comments:boolean = false
  savecomment:boolean = false
  savecontent:boolean = false
  inline_output:boolean = false
  show_inline:boolean = false
  reference: ComponentRef<IModalDialog>
  
  
  dtOptions: DataTables.Settings = {};
  public Editor = ClassicEditor;
  dtTrigger: Subject<any> = new Subject();
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering

  constructor(private el: ElementRef,public globals: Globals) {   }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    
    // no processing needed  
    this.actionButtons = [
      { text: 'Save', onAction: () => this.NodeCompleted(options.data.id) },
      { text: 'Edit', onAction: () => this.NodeEdit() },
      { text: 'Close' }, // no special processing here
    ];
    options.actionButtons=this.actionButtons
    this.input = options.data.input
    this.output = options.data.output
    this.comments = options.data.comments
    this.name = options.data.name
    this.nodeId = options.data.id
    this.description = options.data.description
    this.resources = options.data.resources
  }

  ngOnInit() {
 
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.savecomment = true
    this.savecontent = true
  }

  NodeCompleted(id){

    this.inline_output = true
    this.inline_comments = true
   
    for (let i in this.globals._graphData.edges ){
      if (this.globals._graphData.edges[i].data.source==id){
        let target_id=this.globals._graphData.edges[i].data.target
        
        for (let j in this.globals._graphData.nodes) {
          // Save Output to the next input node
          if (this.globals._graphData.nodes[j].data.id==target_id){
            this.globals._graphData.nodes[j].data.input = Object.assign([], this.input);
            this.globals._graphData.nodes[j].data.input.push({"id":this.nodeId,"name":this.name,"content":this.output,"comment":this.comments})
            this.globals._graphData.nodes[j].data.faveColor = "#FFB266"
            this.globals._graphData.nodes[j].data.borderColor = "#FFB266"
          }  
          // Save Output info
          if (this.globals._graphData.nodes[j].data.id==id){ 
            this.globals._graphData.nodes[j].data.output = this.output
            this.globals._graphData.nodes[j].data.comments = this.comments
            this.globals._graphData.nodes[j].data.faveColor = "#ED7D31"
            this.globals._graphData.nodes[j].data.borderColor = "#ED7D31"
          }
        }
      }
    }
    this.globals.cy.style().update()
    return false
  }

  NodeEdit(){
    this.inline_output = false
    this.inline_comments = false
    return false
  }
}
