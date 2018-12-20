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
export class NodeInfoComponent implements OnInit, AfterViewInit, IModalDialog, OnDestroy {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective; 
  out_table = []
  input_table = []
  objectKeys = Object.keys;
  columnid:number = 1;
  columns:any;
  confirmed_columns:any;
  editInfoOut:Array<any>;
  nodeId:number;
  public editorValue: string = '';

  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering

  constructor(private el: ElementRef,public globals: Globals) {   }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    
    // no processing needed
    this.input_table =(JSON.parse(JSON.stringify(options.data.input)))
    if ( this.input_table.length==0){
      this.out_table =  (JSON.parse(JSON.stringify(options.data.output)))
    }
    else{
      if (options.data.output.length == 0){
        this.out_table = (JSON.parse(JSON.stringify(options.data.input)))
      }
      else{
        this.out_table = (JSON.parse(JSON.stringify(options.data.output)))
      }
    } 
    this.nodeId = options.data.id
  }
  ngOnInit() {
    
    this.columns = {}
    this.confirmed_columns = {}
    this.editInfoOut=[]
    for (let i in this.out_table){
        for (let key of this.objectKeys(this.out_table[i])){
          this.editInfoOut[i] = {}
          this.editInfoOut[i][key]=false
          this.columns[key]=key
          this.confirmed_columns[key]=true
        }
    }
    
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  NodeCompleted(id){

    let aux_out_table = []
    let aux_columns = {}
    let aux_confirmed_columns = {}
    let aux_editInfoOut = []
    for (let i in this.out_table){
      aux_out_table [i] = {}
      aux_editInfoOut [i]= {}
      for (let key of this.objectKeys(this.out_table[i])){
          aux_out_table[i][this.columns[key]]=this.out_table[i][key]
          aux_columns[this.columns[key]]=this.columns[key]
          aux_confirmed_columns[this.columns[key]]=this.columns[key]
          aux_editInfoOut[i][this.columns[key]]=false
      }
    }
    this.out_table = aux_out_table
    this.columns = aux_columns
    this.confirmed_columns = aux_confirmed_columns
    this.editInfoOut = aux_editInfoOut
    for (let i in this.globals._graphData.edges ){
      if (this.globals._graphData.edges[i].data.source==id){
        let target_id=this.globals._graphData.edges[i].data.target
        for (let j in this.globals._graphData.nodes) {
            if (this.globals._graphData.nodes[j].data.id==target_id){       
              this.globals._graphData.nodes[j].data.input = this.out_table;
            }
            if (this.globals._graphData.nodes[j].data.id==id){
              this.globals._graphData.nodes[j].data.output = this.out_table;
              this.globals._graphData.nodes[j].data.faveColor = "#00AA00";
            }
        }
      }
    }
   
  }

  NodeReset(id){
   /* this.globals.actual_node.executed=false;
    jQuery("#icon_status_"+id).css({'color': 'red'})*/
  }

  /*Add new row to the table*/
  Add_row(){
  
    let dict = {}
    let dictEdit = {}
    if (this.out_table.length > 0){
      for ( let key of this.objectKeys(this.out_table[0])){
        dict[key]="-"
        dictEdit[key]=true
      }
    }
    else{    
      let columnName = "ColumnName"+this.columnid
      dict[columnName] = "-"
      dictEdit[columnName]=true
      this.columns[columnName] = columnName
      this.columnid++
      
    }
    this.out_table.push(dict)
    this.editInfoOut.push(dictEdit)

    this.rerender();
  }

  /*Add New column to the table*/
  Add_column() {
    
    let columnName = "ColumnName"
    var finalName = ""
    let namefound:boolean=false
    //Select new name
    if (this.out_table.length > 0){
      while (!namefound) {
        finalName=columnName+this.columnid  
        if (this.objectKeys(this.out_table[0]).indexOf(finalName)==-1){
          namefound=true
        }
        this.columnid++
      }
      //Add column
      for (let i in this.out_table) {
        this.out_table[i][finalName]="-"
        this.editInfoOut[i][finalName]=true
      }
    }
    else{
    
      finalName = "ColumnName"+this.columnid
      this.columnid++
      //Add column
      this.out_table[0]={}  
      this.editInfoOut[0]={}  
      this.out_table[0][finalName]="-"
      this.editInfoOut[0][finalName]=true
    
    } 
    this.columns[finalName] = finalName 

    this.rerender();
  }

  saveNameColumn(oldName){
    this.confirmed_columns[oldName]=oldName
  }
  editColumn(columnName){
    delete this.confirmed_columns[columnName]
  }

  deleteColumn(columnName){
    for (let i in this.out_table) {    
      delete this.out_table[i][columnName]  
      delete this.out_table[i][this.confirmed_columns[columnName]]
    }
    if (this.objectKeys(this.out_table[0]).length == 0) {
      this.out_table= []
    }
    delete this.confirmed_columns[columnName]
    delete this.columns[columnName]
  }

  saveCellOut(i,key){
    this.editInfoOut[i][key]=false
    if (this.out_table[i][key]==""){
      this.out_table[i][key]="-"
    }
  }
  confirmNewRow(i:number){
    for (let key of this.objectKeys(this.editInfoOut[i])){
      if (this.out_table[i][key]==""){
        this.out_table[i][key]="-"
      }
      this.editInfoOut[i][key] =false
    }
  }
  deleteRow(i:number){
   this.editInfoOut.splice(i, 1)
   this.out_table.splice(i, 1)
  }
  editOldCell(i,key){
    this.editInfoOut[i][key]=true
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

}
