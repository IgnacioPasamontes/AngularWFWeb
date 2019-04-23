import { Component, OnInit, Input, AfterViewInit, ViewContainerRef, OnDestroy , OnChanges} from '@angular/core';
declare var jQuery: any;
import { Globals } from '../globals';
import { INode, ILink } from '../node';
import { ModalDialogService, IModalDialogButton } from 'ngx-modal-dialog';
import { NodeInfoComponent } from '../node-info/node-info.component';
import { ToastrService } from 'ngx-toastr';
import { Alert } from 'selenium-webdriver';
import { EachWorkflowService } from './each-workflow.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
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
  actual_node = undefined;
  display = 'none';

  output = '';
  comments = '';
  input: Array<any> = [];
  resources: Array<any> = [];
  description: string;
  name: string;
  project: number;
  node_seq: number;

  public Editor = ClassicEditor;

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



  nodeInfo_selected(project: string, node_id: number) {

    const project_id = this.globals.actual_user.projects[project];
    // GET ID PROJECT

    this.service.getNodeInfo(project_id, node_id).subscribe(
      result => {
        //this.actual_node = result;
        console.log(result);
        this.input = result.inputs;
        this.output = result.outputs;
        this.comments = result.outputs_comments;
        this.name = result.name;
        this.project = result.project;
        this.description = result.description;
        this.resources = result.resources;
        this.node_seq = result.node_seq;
        this.display = 'block';
        /*this.modalService.openDialog(this.viewRef, {
          title: result.name,
          childComponent: NodeInfoComponent,
          settings: {
            closeButtonClass: 'close mdi mdi-close',
            modalDialogClass: 'modal-dialog'
          },
          data: result
        });*/
      },
      error => {
        alert('Error getting node');
      }
    );
  }

  reDraw() {
    $('.' + this.projectName).connections('update');
  }

  NodeCompleted( project_id: number, node_id: number) {

    this.service.saveNode (project_id, node_id, this.output, this.comments).subscribe(
      result => {
        console.log(result);
      }
    );
    this.globals.change =  !this.globals.change;
    this.display = 'none';
  }

  onCloseHandled() {
    this.display = 'none';
  }
}
