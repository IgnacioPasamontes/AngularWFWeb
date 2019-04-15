import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewContainerRef, ViewChild, OnChanges } from '@angular/core';
declare var jQuery: any;
import { Globals } from '../globals';
import { INode } from '../node';
import * as cytoscape from 'cytoscape';
import { ModalDialogService, IModalDialogButton } from 'ngx-modal-dialog';
import { NodeInfoComponent } from '../node-info/node-info.component';
import { ToastrService } from 'ngx-toastr';
import { jsPlumb } from 'jsplumb';

@Component({
  selector: 'app-each-workflow',
  templateUrl: './each-workflow.component.html',
  styleUrls: ['./each-workflow.component.css']
})
export class EachWorkflowComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() projectName;
  jsPlumbInstance;

  constructor(public globals: Globals,
    private  modalService: ModalDialogService,
    private viewRef: ViewContainerRef,
    private toastr: ToastrService) { }

  ngOnInit() {  }
  ngOnChanges() {
    console.log('changes');
  }

  ngAfterViewInit() {
    this.jsPlumbInstance = jsPlumb.getInstance();
    this.jsPlumbInstance.connect({
      connector: ['Flowchart', {stub: [212, 67], cornerRadius: 1, alwaysRespectStubs: true}],
      source: 'id_1',
      target: 'id_2',
      anchor: ['Top', 'Bottom'],
      paintStyle: {stroke: '#456', strokeWidth: 4},
    });
  }



  nodeInfo_selected(node) {
    this.modalService.openDialog(this.viewRef, {
      title: node.name,
      childComponent: NodeInfoComponent,
      settings: {
        closeButtonClass: 'close mdi mdi-close',
        modalDialogClass: 'modal-dialog'
      },
      data: node/*,
      onClose: () => new Promise((resolve: any) => {
        this.cy.style().update()
			  resolve();
       })*/
    });

  }
}
