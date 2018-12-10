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
      {data: {id: '1', name: 'Problem formulation', weight: 300, faveColor: '#6FB1FC', faveShape: 'rectangle'}},
      {data: {id: '2', name: 'TC Characterization', weight: 300, faveColor: '#EDA1ED', faveShape: 'rectangle'}},
      {data: {id: '3', name: 'Metabolism data', weight: 250, faveColor: '#86B342', faveShape: 'rectangle'}},
      {data: {id: '4', name: 'SCs identification', weight: 300, faveColor: '#F5A45D', faveShape: 'rectangle'}},
      {data: {id: '5', name: 'SCs evaluation', weight: 250, faveColor: '#86B342', faveShape: 'rectangle'}},
      {data: {id: '6', name: 'Enough information', weight: 300, faveColor: '#86B342', faveShape: 'rectangle'}},
      {data: {id: '7', name: 'RA hypothesis', weight: 250, faveColor: '#86B342', faveShape: 'rectangle'}}
    ],
    edges: [
      {data: {source: '1', target: '2', faveColor: '#6FB1FC'}},
      {data: {source: '2', target: '3', faveColor: '#6FB1FC'}},
      {data: {source: '3', target: '4', faveColor: '#6FB1FC'}},

      {data: {source: '4', target: '5', faveColor: '#EDA1ED'}},
      {data: {source: '5', target: '6', faveColor: '#EDA1ED'}},

      {data: {source: '6', target: '7', faveColor: '#86B342'}},
      {data: {source: '6', target: '2', faveColor: '#86B342'}}
    ]
  };

  constructor(public globals: Globals) {
  }

  nodeInfo_selected(operatorId){
    this.globals.node_visible = false;

  }

  nodeInfo_unselected(){
   
  }
 
  onItemDrop2(e: any) {
   
  }
  onItemDrop(e: any) {
   
  }

  ngOnInit() {

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
        'width': 'data(weight)',
        'height': 40,
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
          name: 'grid',
          directed: true,
          padding: 10,
          cols:1
      },
      zoom: 1,
      selectionType: 'single', 

    });
    
    this.cy.on('click', 'node', (evt)=>{
      var node = evt.target; 
      this.nodeInfo_selected(node.id())
    });

  }
}
  
