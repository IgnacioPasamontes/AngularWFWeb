import { Component, OnInit, ElementRef } from '@angular/core';
import {Globals} from '../globals';

declare var jQuery: any;

@Component({
  selector: 'app-node-info',
  templateUrl: './node-info.component.html',
  styleUrls: ['./node-info.component.css']
})
export class NodeInfoComponent implements OnInit {

  out_table = []
  input_table = []
  newRows: Array<any>;
  objectKeys = Object.keys;
  columnid:number = 1;
  confirmed_columns:any;
  editInfoOut:Array<any>;
  editInfoNew:Array<any>;

  constructor(private el: ElementRef,public globals: Globals) { }

  ngOnInit() {
    
    this.confirmed_columns = {}
    this.input_table[0]={"Name":"Acetylsalicylic Acid (ASA)","Smiles":"O=C(C)Oc1ccccc1C(=O)O"}
    this.input_table[1]={"Name":"Metformin","Smiles":"CN(C)C(=N)NC(=N)N"}
    

    this.out_table[0]={"Name":"Acetylsalicylic Acid (ASA)","Smiles":"O=C(C)Oc1ccccc1C(=O)O"}
    this.out_table[1]={"Name":"Metformin","Smiles":"CN(C)C(=N)NC(=N)N"}
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
    this.globals.actual_node.executed=true;
    jQuery("#icon_status_"+id).css({'color': 'green'})
  }

  NodeReset(id){
    this.globals.actual_node.executed=false;
    jQuery("#icon_status_"+id).css({'color': 'red'})
  }

  /*Add new row to the table*/
  Add_row(){

    var dict = {}
    var dictEdit = {}
    for ( let key of this.objectKeys(this.out_table[0])){
      dict[key]=""
      dictEdit[key]=true
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
    for (let i in this.newRows) {
      this.newRows[i][columnName]=""
      this.editInfoNew[i][columnName]=true
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

  confirmNewRow(i:number){
    alert(i);

  }


}
