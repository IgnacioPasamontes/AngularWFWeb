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
  cy:any =null;
  actionButtons: IModalDialogButton[];
 

  constructor(public globals: Globals,
    private  modalService: ModalDialogService, 
    private viewRef: ViewContainerRef,
    private toastr: ToastrService) {


    this.actionButtons = [
      { text: 'Close' }, // no special processing here
      { text: 'I will always close', onAction: () => true },
      { text: 'I never close', onAction: () => false }
    ];
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
        'content': 'data(name)',
        'width': 'data(weight)',
        'height': 60,
        
        'text-valign': 'center',
        'text-outline-width': 2,
        'text-outline-color': 'data(faveColor)',
        'background-color': 'data(faveColor)',
        'color': '#fff'
        }
     }/*,

      {
        selector: 'edge',
        style: {
          'curve-style': 'haystack',
          'opacity': 0.666,
          //'width': 'mapData(strength, 70, 100, 2, 6)',
          'target-arrow-shape': 'triangle',
         // 'source-arrow-shape': 'circle',
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
     */ ],
      elements: {
          nodes:this.globals._graphData.nodes,
          edges: this.globals._graphData.edges                
      }/*,
      layout: {
          name: 'grid',
          directed: true,
          padding: 10,
          cols:1
      },
      zoom: 1,
      selectionType: 'single', */

    });
    
    this.cy.on('click', 'node', (evt)=>{
      var node = evt.target; 
      if (node.json().data.faveColor=="#FF3333"){
        this.toastr.warning('You must save previous step.','Warining!')
      }
      else{
        this.nodeInfo_selected(node.json().data)
      }
     
    });

  }

  nodeInfo_selected(node){
    //this.globals.node_visible = false;
    this.modalService.openDialog(this.viewRef, {
      title: node.name,
      childComponent: NodeInfoComponent,
      //actionButtons:this.actionButtons,
      settings: {
        closeButtonClass: "close mdi mdi-close",
        modalDialogClass: "modal-dialog"
      },
      data: node,
      onClose: () => new Promise((resolve: any) => {
        this.cy.style().update()
			  resolve();
          
       })
    });

  }

}
  
