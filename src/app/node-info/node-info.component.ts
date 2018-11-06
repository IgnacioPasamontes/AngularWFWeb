import { Component, OnInit, ElementRef } from '@angular/core';
import {Globals} from '../globals';
declare var jQuery: any;

@Component({
  selector: 'app-node-info',
  templateUrl: './node-info.component.html',
  styleUrls: ['./node-info.component.css']
})
export class NodeInfoComponent implements OnInit {

  constructor(private el: ElementRef,public globals: Globals) { }

  ngOnInit() {
    /*this.globals.actual_node.title = "title"
    this.globals.actual_node.info = "Problem formulation INFO",
    this.globals.actual_node.parameters = "info"
    this.globals.actual_node.inputs = {}
    this.globals.actual_node.outputs = {}
    this.globals.actual_node.executed = true*/
  }

  NodeCompleted(id){
    this.globals.actual_node.executed=true;
    jQuery("#icon_status_"+id).css({'color': 'green'})
  }

  NodeReset(id){
    this.globals.actual_node.executed=false;
    jQuery("#icon_status_"+id).css({'color': 'red'})
  }

}
