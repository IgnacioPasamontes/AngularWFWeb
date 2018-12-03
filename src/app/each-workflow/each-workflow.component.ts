import { Component, OnInit, Input, AfterViewInit, ElementRef } from '@angular/core';
declare var jQuery: any;
import { Globals } from '../globals';
import { INode } from '../node';
import * as cytoscape from 'cytoscape';


@Component({
  selector: 'app-each-workflow',
  templateUrl: './each-workflow.component.html',
  styleUrls: ['./each-workflow.component.css']
})
export class EachWorkflowComponent implements OnInit {

  @Input() projectName;
  cy:any =null;
  private _graphData: any = {
    nodes: [
      {data: {id: 'j', name: 'Jerry', faveColor: '#6FB1FC', faveShape: 'triangle'}},
      {data: {id: 'e', name: 'Elaine', faveColor: '#EDA1ED', faveShape: 'ellipse'}},
      {data: {id: 'k', name: 'Kramer', faveColor: '#86B342', faveShape: 'octagon'}},
      {data: {id: 'g', name: 'George', faveColor: '#F5A45D', faveShape: 'rectangle'}}
    ],
    edges: [
      {data: {source: 'j', target: 'e', faveColor: '#6FB1FC'}},
      {data: {source: 'j', target: 'k', faveColor: '#6FB1FC'}},
      {data: {source: 'j', target: 'g', faveColor: '#6FB1FC'}},

      {data: {source: 'e', target: 'j', faveColor: '#EDA1ED'}},
      {data: {source: 'e', target: 'k', faveColor: '#EDA1ED'}},

      {data: {source: 'k', target: 'j', faveColor: '#86B342'}},
      {data: {source: 'k', target: 'e', faveColor: '#86B342'}},
      {data: {source: 'k', target: 'g', faveColor: '#86B342'}},

      {data: {source: 'g', target: 'j', faveColor: '#F5A45D'}}
    ]
  };

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    

    this.cy = cytoscape({
      container: document.getElementById('cy'),
      boxSelectionEnabled: true,
      autounselectify: true,
      autoungrabify:true,
      userPanningEnabled :false,
      style: [{
        selector: 'node',
        style: {
        'shape': 'data(faveShape)',
        'width': 'mapData(weight, 40, 80, 20, 60)',
        'content': 'data(name)',
        'text-valign': 'center',
        'text-outline-width': 2,
        'text-outline-color': 'data(faveColor)',
        'background-color': 'data(faveColor)',
        'color': '#fff'
        }
      },

      {
        selector: 'edge',
        style: {
          'curve-style': 'bezier',
          'opacity': 0.666,
          'width': 'mapData(strength, 70, 100, 2, 6)',
          'target-arrow-shape': 'triangle',
          'source-arrow-shape': 'circle',
          'line-color': 'data(faveColor)',
          'source-arrow-color': 'data(faveColor)',
          'target-arrow-color': 'data(faveColor)'
        }
      },

      {
        selector: ':selected',
        style: {
          'border-width': 3,
          'border-color': '#333'
        }
      },

      {
        selector: 'edge.questionable',
        style: {
          'line-style': 'dotted',
          'target-arrow-shape': 'diamond'
        }
      },
      {
        selector: '.faded',
        style: {
          'opacity': 0.25,
          'text-opacity': 0
        }
      }
      ],
      elements: {
          nodes:this._graphData.nodes,
          edges: this._graphData.edges                
      },
      layout: {
          name: 'cose',
          directed: true,
          padding: 10
      },
      zoom: 1,
      selectionType: 'single', 

    }); 
  }

  get graphData(): any {
    console.log(this._graphData);
    alert("Hola")
    return this._graphData;
  }

  set graphData(value: any) {
    this._graphData = value;
  }
  
  
  nodeInfo_selected(operatorId){

  }

  nodeInfo_unselected(){
   
  }
 
  onItemDrop2(e: any) {
   
  }
  onItemDrop(e: any) {
   
  }
}
  
