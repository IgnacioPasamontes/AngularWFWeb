import { Component, OnInit, ElementRef, ComponentRef } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import {Globals} from '../globals';

declare var jQuery: any;

@Component({
  selector: 'app-node-info',
  templateUrl: './node-info.component.html',
  styleUrls: ['./node-info.component.css']
})
export class NodeInfoComponent implements OnInit, IModalDialog {

  out_table = []
  input_table = []
  newRows: Array<any>;
  objectKeys = Object.keys;
  columnid:number = 1;
  confirmed_columns:any;
  editInfoOut:Array<any>;
  editInfoNew:Array<any>;
  nodeId:number;

  constructor(private el: ElementRef,public globals: Globals) { }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    // no processing needed
    this.out_table =  options.data.input
    this.input_table = options.data.input
    this.nodeId = options.data.id
    alert("Node Id "+this.nodeId)
  }
  ngOnInit() {
    
    this.confirmed_columns = {}
    //this.input_table[0]={"Name":"Acetylsalicylic Acid (ASA)","Smiles":"O=C(C)Oc1ccccc1C(=O)O"}
    //this.input_table[1]={"Name":"Metformin","Smiles":"CN(C)C(=N)NC(=N)N"}
    

    /*this.out_table[0]={"Name":"Acetylsalicylic Acid (ASA)","Smiles":"O=C(C)Oc1ccccc1C(=O)O"}
    this.out_table[1]={"Name":"Metformin","Smiles":"CN(C)C(=N)NC(=N)N"}*/
    this.editInfoOut=[]
    for (let i in this.out_table){
        for (let key of this.objectKeys(this.out_table[i])){
          this.editInfoOut[i] = {}
          this.editInfoOut[i][key]=false
          this.confirmed_columns[key]=key
        }
    }
    
    this.newRows = [];
    this.editInfoNew = [];
    
  }

  NodeCompleted(id){

    for (let i in this.out_table){
      for (let key of this.objectKeys(this.out_table[i])){
        if (this.confirmed_columns[key]){
          this.out_table[i][this.confirmed_columns[key]]=this.out_table[i][key]
          delete this.out_table[i][key]
        }
      }
    }
    for (let i in this.newRows){
      for (let key of this.objectKeys(this.newRows[i])){
        if (this.confirmed_columns[key]){
          this.newRows[i][this.confirmed_columns[key]]=this.newRows[i][key]
          delete this.newRows[i][key]
        }
      }
    }

    for (let i in this.globals._graphData.edges ){
      if (this.globals._graphData.edges[i].data.source==id){
        var target_id=this.globals._graphData.edges[i].data.target
        for (let j in this.globals._graphData.nodes) {
            if (this.globals._graphData.nodes[j].data.id==target_id){
              console.log(this.out_table.concat(this.newRows))
              this.globals._graphData.nodes[j].data.input = this.newRows.concat(this.out_table);
              alert("Change")
            }
        }
      }
    }
   
    /*this.globals.actual_node.executed=true;
    jQuery("#icon_status_"+id).css({'color': 'green'})*/
  }

  NodeReset(id){
   /* this.globals.actual_node.executed=false;
    jQuery("#icon_status_"+id).css({'color': 'red'})*/
  }

  /*Add new row to the table*/
  Add_row(){

    var dict = {}
    var dictEdit = {}
    if (this.out_table.length > 0){
      for ( let key of this.objectKeys(this.out_table[0])){
        dict[key]=""
        dictEdit[key]=true
      }
    }
    else{
      if (this.newRows.length > 0){
        for ( let key of this.objectKeys(this.newRows[0])){
          dict[key]=""
          dictEdit[key]=true
        }
      }
      else{
        var columnName = "ColumnName"+this.columnid
        dict[columnName] = ""
        dictEdit[columnName]=true
        this.columnid++
      }
    }
    this.newRows.push(dict)
    this.editInfoNew.push(dictEdit)
  }

  /*Add New column to the table*/
  Add_column(){
    var columnName = "ColumnName"+this.columnid
    for (let i in this.out_table) {
      this.out_table[i][columnName]=""
      this.editInfoOut[i][columnName]=true
    }
    if (this.newRows.length>0) {
      for (let i in this.newRows) {
        this.newRows[i][columnName]=""
        this.editInfoNew[i][columnName]=true
      }
    }
    else{
      this.newRows[0][columnName]=""
      this.editInfoNew[0][columnName]=true
    }
    this.columnid++
  }

  saveNameColumn(oldName,e){
    let new_name = e.srcElement.parentElement.parentElement.firstChild.value
    this.confirmed_columns[oldName]=new_name
  }
  existConfirmedColumn(columnName){
    return this.confirmed_columns.has(columnName)
  }

  editColumn(columnName){
    delete this.confirmed_columns[columnName]
  }

  deleteNameColumn(columnName){
    for (let i in this.out_table) {    
      delete this.out_table[i][columnName]  
      delete this.out_table[i][this.confirmed_columns[columnName]]
    }
    for (let i in this.newRows) {
      delete this.newRows[i][columnName]
      delete this.newRows[i][this.confirmed_columns[columnName]]
    }
    delete this.confirmed_columns[columnName]
  }

  saveCellOut(i,key){
    this.editInfoOut[i][key]=false
    if (this.out_table[i][key]==""){
      this.out_table[i][key]="-"
    }
  }
  saveCellNew(i,key){
    this.editInfoNew[i][key]=false
    if (this.newRows[i][key]==""){
      this.newRows[i][key]="-"
    }
  }
  confirmNewRow(i:number){
    for (let key of this.objectKeys(this.editInfoNew[i])){
      if (this.newRows[i][key]==""){
        this.newRows[i][key]="-"
      }
      this.editInfoNew[i][key] =false
    }
  }
  deleteNewRow(i:number){
   this.editInfoNew.splice(i, 1)
   this.newRows.splice(i, 1)
  }

  editNewCell(i,key){
    this.editInfoNew[i][key]=true
  }
  editOldCell(i,key){
    this.editInfoOut[i][key]=true
  }

  columnsAvailable(arr1:Array<any>,arr2:Array<any>){

    var outArray={}
    if (arr1.length > 0){
      for (let key of this.objectKeys(arr1[0])){
        outArray[key]=""
      }
    }
    if (arr2.length > 0){
      for (let key of this.objectKeys(arr2[0])){
        outArray[key]=""
      }
    }
    return this.objectKeys(outArray)
  }
}
