import { Component, OnInit, ElementRef, ComponentRef, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import { IModalDialog, IModalDialogOptions, IModalDialogButton } from 'ngx-modal-dialog';
import {Globals} from '../globals';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { KeyRegistry } from '@angular/core/src/di/reflective_key';

declare let jQuery: any;

@Component({
  selector: 'app-node-info',
  templateUrl: './node-info.component.html',
  styleUrls: ['./node-info.component.css']
})
export class NodeInfoComponent implements OnInit, IModalDialog {

 
  output:string = ''
  comments:string = ''
  input:Array<any> = []
  description:string;
  objectKeys = Object.keys;
  columnid:number = 1;
  columns:any;
  confirmed_columns:any;
  editInfoOut:Array<any>;
  nodeId:number;
  inline_comments:boolean = false
  inline_output:boolean = false
  show_inline:boolean = false
  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering

  constructor(private el: ElementRef,public globals: Globals) {   }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    
    // no processing needed
    this.input = options.data.input
    this.output = ''
    this.nodeId = options.data.id
    this.description = options.data.description
  }

  ngOnInit() {
    
  }

  NodeCompleted(id){

    this.inline_output = true
    this.inline_comments = true
   
    for (let i in this.globals._graphData.edges ){
      if (this.globals._graphData.edges[i].data.source==id){
        let target_id=this.globals._graphData.edges[i].data.target
        for (let j in this.globals._graphData.nodes) {
            if (this.globals._graphData.nodes[j].data.id==target_id){       
              this.globals._graphData.nodes[j].data.input=this.input.push({"id":this.nodeId,"name":this.description,"content":this.output,"comment":this.comments})
              alert("Fin")
            }
    
        }
      }
    }
   
  }

  NodeReset(id){
   /* this.globals.actual_node.executed=false;
    jQuery("#icon_status_"+id).css({'color': 'red'})*/
    this.inline_output = false
    this.inline_output = false
  }
  }
}
