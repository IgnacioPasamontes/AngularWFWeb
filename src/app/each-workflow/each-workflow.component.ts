import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
declare var jQuery: any;
import { Globals } from '../globals';
import { INode } from '../node';
import * as cytoscape from 'cytoscape';
import { ModalDialogService,IModalDialogButton } from 'ngx-modal-dialog';
import { NodeInfoComponent } from '../node-info/node-info.component';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-each-workflow',
  templateUrl: './each-workflow.component.html',
  styleUrls: ['./each-workflow.component.css']
})
export class EachWorkflowComponent implements OnInit {

  @Input() projectName;
  @ViewChild('myModal') modal: any;
  


  constructor(public globals: Globals,
    private  modalService: ModalDialogService, 
    private viewRef: ViewContainerRef,
    private toastr: ToastrService) {    
  }

 

  nodeInfo_unselected(){
   
  }
 
  onItemDrop2(e: any) {
   
  }
  onItemDrop(e: any) {
   
  }

  ngOnInit() {

    this.globals.cy = cytoscape({
      container: document.getElementById('cy'),

     /* boxSelectionEnabled: true,
      autounselectify: true,
      autoungrabify:true,
      userPanningEnabled :false,*/

     style: [{
        selector: 'node',
        style: {
        'shape': 'data(faveShape)',
        'width': 'data(weight)',
        'height': 'data(height)',
        'content': 'data(name)',        
        'text-valign': 'center',
        'font-size': '20%',
        'text-outline-width': 5,
        'text-outline-color': 'data(faveColor)',
        'background-color': 'data(faveColor)',
        'color': 'white',
        'border-color': 'data(borderColor)',
        'border-width': 6,
        
        }
     },
     {
      selector: '$node > node',
      css: {
        'padding':'20px',
        'margin':'20px',
        'text-valign': 'top',
        'text-halign': 'center',
        'background-color': 'data(faveColor)'
      }
    },

      {
        
        selector: 'edge',
        style: {
          'curve-style': 'bezier',
          //'width': 'mapData(strength, 70, 100, 2, 6)',
          'target-arrow-shape': 'triangle',
          'line-color': 'data(edgeColor)',
          'target-arrow-color': 'data(edgeColor)',
          
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
          nodes:this.globals._graphData.nodes,
          edges: this.globals._graphData.edges                
      },
      layout: {
        name: 'grid',
        position: function(node:any) { 
            return {
              row: node.data('row'),
              col: node.data('col')
          } 
        },
        cols:3
      },
      //zoom: 1,
      //selectionType: 'single', 

    });
    
    this.globals.cy.on('click', 'node', (evt)=>{
      var node = evt.target; 
      if (node.json().data.faveColor=="#A5A5A5"){
        this.toastr.warning('You must save previous step.','Warining!')
      }
      else if(node.json().data.name!="") {
        this.nodeInfo_selected(node.json().data)
      }
     
    });

  }

  

  nodeInfo_selected(node){
    this.modalService.openDialog(this.viewRef, {
      title: node.name,
      childComponent: NodeInfoComponent,
      
      settings: {
        closeButtonClass: "close mdi mdi-close",
        modalDialogClass: "modal-dialog"
      },
      data: node/*,
      onClose: () => new Promise((resolve: any) => {
        this.cy.style().update()
			  resolve();
          
       })*/
    });

  }
}
  
