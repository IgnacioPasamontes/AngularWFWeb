import { Component, OnInit, Input, AfterViewInit, ViewContainerRef, OnDestroy , OnChanges} from '@angular/core';
declare var jQuery: any;
import { Globals } from '../globals';
import { INode, ILink } from '../node';
import { ModalDialogService, IModalDialogButton } from 'ngx-modal-dialog';
import { NodeInfoComponent } from '../node-info/node-info.component';
import { ToastrService } from 'ngx-toastr';
import { Alert } from 'selenium-webdriver';
import { EachWorkflowService } from './each-workflow.service'
declare var $: any;

@Component({
  selector: 'app-each-workflow',
  templateUrl: './each-workflow.component.html',
  styleUrls: ['./each-workflow.component.css']
})
export class EachWorkflowComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input() projectName;
  @Input() visibleProject: string;
  @Input() change: boolean;

  constructor(public globals: Globals,
    private  modalService: ModalDialogService,
    private viewRef: ViewContainerRef,
    private toastr: ToastrService,
    private service: EachWorkflowService) { }

    checked = {
    'node1': false,
    'node2': false,
    'node3': false,
    'node4': false,
    'node5': false,
    'node6': false,
    'node7': false,
    'node8': false,
    'node9': false,
    'node10': false,
    'node11': false,
    'node12': false
  };

  ngOnInit() {
  }
   ngOnChanges () {
    if (this.visibleProject !== '') {
      if (this.projectName === this.visibleProject) {
        this.ngAfterViewInit();
      }
    }
  }
  ngOnDestroy() {
    $('.' + this.projectName).connections('remove');
  }

  async ngAfterViewInit() {
    let nodes_info;
      nodes_info = await this.service.getProjectInfoSync(this.globals.actual_user.projects[this.projectName]);
      for (const node of nodes_info) {
        this.checked['node' + node.node_seq] = node.executed === 'True' ? true : false;
      }
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
    const that = this;
    setTimeout(function() {
      that.reDraw();
    }, 200);
  }



  async nodeInfo_selected(project: string, node_id: number) {

    const project_id = this.globals.actual_user.projects[project];
    // GET ID PROJECT
    let node = new INode();
    const inputs = [];
    const inputs_comments = [];
    let i = 1;
    let res;

    while (i < node_id) {
      res = await this.service.getNodeInfoSync(project_id, i);
      inputs.push({'name': res.name, 'content': res.outputs, 'comment': res.outputs_comments});
      i++;
    }
    this.service.getNodeInfo(project_id, node_id).subscribe(
      result => {
       node = result;
       node.inputs = inputs;
       this.service.getResources(node_id).subscribe(
        resources => {
          node.resources = [];
          for (const source of resources) {
            console.log(source);
            const link = new ILink();
            link.label = source.resources_name;
            link.link = source.resources_link;
            node.resources.push(link);
          }
          this.modalService.openDialog(this.viewRef, {
            title: node.name,
            childComponent: NodeInfoComponent,
            settings: {
              closeButtonClass: 'close mdi mdi-close',
              modalDialogClass: 'modal-dialog'
            },
            data: node
          });


        });
      },
      error => {
        alert('Error getting node');
      }
    );
  }

  reDraw() {
    $('.' + this.projectName).connections('update');
  }
}
