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
    this.out_table[2]={"Name":"AA2","Smiles":"CN(C)C(=N)NC(=N)N"}
    this.out_table[3]={"Name":"AA3","Smiles":"CN(C)C(=N)NC(=N)N"}
    this.out_table[4]={"Name":"AA4","Smiles":"CN(C)C(=N)NC(=N)N"}
    this.out_table[5]={"Name":"AA5","Smiles":"CN(C)C(=N)NC(=N)N"}
    this.out_table[6]={"Name":"AA6","Smiles":"CN(C)C(=N)NC(=N)N"}
    this.out_table[7]={"Name":"AA7","Smiles":"CN(C)C(=N)NC(=N)N"}
    this.out_table[8]={"Name":"AA8","Smiles":"CN(C)C(=N)NC(=N)N"}
    this.out_table[9]={"Name":"AA9","Smiles":"CN(C)C(=N)NC(=N)N"}
    this.out_table[10]={"Name":"AA10","Smiles":"CN(C)C(=N)NC(=N)N"}
    this.out_table[11]={"Name":"AA11","Smiles":"CN(C)C(=N)NC(=N)N"}
    this.out_table[12]={"Name":"AA12","Smiles":"CN(C)C(=N)NC(=N)N"}
    this.out_table[13]={"Name":"AA13","Smiles":"CN(C)C(=N)NC(=N)N"}
    this.out_table[14]={"Name":"AA14","Smiles":"CN(C)C(=N)NC(=N)N"}
    this.out_table[15]={"Name":"AA15","Smiles":"CN(C)C(=N)NC(=N)N"}
    this.out_table[16]={"Name":"AA16","Smiles":"CN(C)C(=N)NC(=N)N"}
    this.out_table[17]={"Name":"AA17","Smiles":"CN(C)C(=N)NC(=N)N"}
    this.out_table[18]={"Name":"AA18","Smiles":"CN(C)C(=N)NC(=N)N"}
    this.out_table[19]={"Name":"AA19","Smiles":"CN(C)C(=N)NC(=N)N"}
    this.out_table[20]={"Name":"AA20","Smiles":"CN(C)C(=N)NC(=N)N"}
    
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

    var columnName = "Column"+this.columnid
    for (let i in this.out_table) {
      if (this.new_columns[i]===undefined){  
        this.new_columns[i]={"Column":""}
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
