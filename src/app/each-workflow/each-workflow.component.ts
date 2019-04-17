import { Component, OnInit, Input, AfterViewInit, ViewContainerRef, OnDestroy , OnChanges} from '@angular/core';
declare var jQuery: any;
import { Globals } from '../globals';
import { INode } from '../node';
import { ModalDialogService, IModalDialogButton } from 'ngx-modal-dialog';
import { NodeInfoComponent } from '../node-info/node-info.component';
import { ToastrService } from 'ngx-toastr';
import { Alert } from 'selenium-webdriver';
declare var $: any;

@Component({
  selector: 'app-each-workflow',
  templateUrl: './each-workflow.component.html',
  styleUrls: ['./each-workflow.component.css']
})
export class EachWorkflowComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input() projectName;
  @Input() visibleProject: string;

  constructor(public globals: Globals,
    private  modalService: ModalDialogService,
    private viewRef: ViewContainerRef,
    private toastr: ToastrService) { }

  ngOnInit() {
    
  }
  ngOnChanges () {
    if (this.visibleProject !== '') {
      if (this.projectName === this.visibleProject){
        this.ngAfterViewInit();
      }
    }
  }
  ngOnDestroy() {
    $('.' + this.projectName).connections('remove');
  }

  ngAfterViewInit() {
   
    $('.card').connections('remove');

    $('#' + this.projectName + '_id_1, #' + this.projectName + '_id_2').connections({
      class: 'fast'
    });
    $('#' + this.projectName + '_id_2, #' + this.projectName + '_id_3').connections({
      class: 'fast'
    });
    $('#' + this.projectName + '_id_3, #' + this.projectName + '_id_4').connections({
      class: 'fast'
    });
    $('#' + this.projectName + '_id_4, #' + this.projectName + '_id_5').connections({
      class: 'fast'
    });
    $('#' + this.projectName + '_id_5, #' + this.projectName + '_id_6').connections({
      class: 'fast'
    });
    $('#' + this.projectName + '_id_6, #' + this.projectName + '_id_7').connections({
      class: 'fast'
    });
    $('#' + this.projectName + '_id_7, #' + this.projectName + '_id_8').connections({
      class: 'fast'
    });
    $('#' + this.projectName + '_id_9').connections({
      from: '#' + this.projectName + '_id_8',
      class: 'fast'
    });
    $('#' + this.projectName + '_id_10').connections({
      from: '#' + this.projectName + '_id_8',
      class: 'fast'
    });
    $('#' + this.projectName + '_id_11').connections({
      from: '#' + this.projectName + '_id_9',
      class: 'fast'
    });
    $('#' + this.projectName + '_id_11').connections({
      from: '#' + this.projectName + '_id_10',
      class: 'fast'
    });
    $('#' + this.projectName + '_id_11, #' + this.projectName + '_id_12').connections({
      class: 'fast'
    });
    let that = this;
    setTimeout(function(){
      that.reDraw();
    },200);
    
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

  reDraw() {
    console.log(this.projectName)
    $('.' + this.projectName).connections('update');
  }
}
