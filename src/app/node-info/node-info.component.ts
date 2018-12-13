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
  new_rows: Array<any>;
  new_columns: Array<any>;
  new_columns_name: Array<any>;
  objectKeys = Object.keys;
  columnid:number = 1

  constructor(private el: ElementRef,public globals: Globals) { }

  ngOnInit() {

    /*this.globals.actual_node.title = "title"
    this.globals.actual_node.info = "Problem formulation INFO",
    this.globals.actual_node.parameters = "info"
    this.globals.actual_node.inputs = {}
    this.globals.actual_node.outputs = {}
    this.globals.actual_node.executed = true*/
    this.input_table[0]={"Name":"Acetylsalicylic Acid (ASA)","Smiles":"O=C(C)Oc1ccccc1C(=O)O"}
    this.input_table[1]={"Name":"Metformin","Smiles":"CN(C)C(=N)NC(=N)N"}
    

    this.out_table[0]={"Name":"Acetylsalicylic Acid (ASA)","Smiles":"O=C(C)Oc1ccccc1C(=O)O"}
    this.out_table[1]={"Name":"Metformin","Smiles":"CN(C)C(=N)NC(=N)N"}
    
    this.new_rows= [];
    this.new_columns= [];
    this.new_columns_name = [];
    
  }

  NodeCompleted(id){
    this.globals.actual_node.executed=true;
    jQuery("#icon_status_"+id).css({'color': 'green'})
  }

  NodeReset(id){
    this.globals.actual_node.executed=false;
    jQuery("#icon_status_"+id).css({'color': 'red'})
  }

  Add_row(){

    var dict={}
    for ( let key of this.objectKeys(this.out_table[0])){
      dict[key]=""
    }
    if (this.new_columns.length > 0){
      for (let key of this.objectKeys(this.new_columns[0])){
        dict[key]=""
      }
    }
    this.new_rows.push(dict)   
  }
  Add_column(){

    var columnName = "ColumnName"+this.columnid
    for (let i in this.out_table) {
      if (this.new_columns[i]===undefined){  
        this.new_columns[i]={"ColumnName":""}
      }
      else{
        this.new_columns[i][columnName]=""
      }
    }
    for (let i in this.new_rows) {
      this.new_rows[i][columnName]=""
    }
    
    this.columnid++
  }

}
