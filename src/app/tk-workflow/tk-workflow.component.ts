import { Component, Input, OnInit, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import { Globals } from '../globals';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResizeSensor } from 'css-element-queries';
import { EachWorkflowService } from '../each-workflow/each-workflow.service';


declare var RegExpEscape: any;
declare var $;

@Component({
  selector: 'app-tk-workflow',
  templateUrl: './tk-workflow.component.html',
  styleUrls: ['./tk-workflow.component.css']
})
export class TkWorkflowComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @Input() projectName;
  @Input() visibleProject: string;
  @Input() change: boolean;

  projectClass: string; //also used for IDs

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
    'node12': false,
    'node13': false,
    'node14': false,
    'node15': false,
    'node16': false,
    'node17': false,
    'node18': false
  };

  constructor(public globals: Globals,
              private eachworkflowservice: EachWorkflowService,
              ) { }

  ngOnInit() {
    const tk_class_name = this.projectName.replace(
      new RegExp(RegExpEscape(this.globals.tk_project_suffix)+'$'),
      this.globals.tk_class_suffix
    )

    this.projectClass = tk_class_name; //also used for IDs

    //this.updateCheckedNodes();
  }

  ngOnChanges (changes) {
    if (this.visibleProject !== '') {
      if (this.projectName === this.visibleProject) {
        if (changes.hasOwnProperty('visibleProject')) {
          this.drawConnections();
        }
        if (changes.hasOwnProperty('change')) {
          //this.updateCheckedNodes();
        }
      }
    }
  }


  ngOnDestroy() {

    (<any>$('.' + this.projectClass)).connections('remove');
  }

  drawConnections() {
    (<any>$('.' + this.projectClass)).connections('remove');

    $('#' + this.projectClass + '_id_13, #' + this.projectClass + '_id_16').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_id_14, #' + this.projectClass + '_id_17').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_id_15, #' + this.projectClass + '_id_18').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_id_16, #' + this.projectClass + '_id_19').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_id_17, #' + this.projectClass + '_id_19').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_id_18, #' + this.projectClass + '_id_20').connections({
      class: 'fast'
    });
    /*$('#' + this.projectClass + '_id_20, #' + this.projectClass + '_id_13').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_id_20, #' + this.projectClass + '_id_14').connections({
      class: 'fast'
    });*/
  }

  async updateCheckedNodes() {
    let nodes_info;
    nodes_info = await this.eachworkflowservice.getProjectInfoSync(this.globals.current_user.projects[this.projectName]);

    for (const node of nodes_info) {
      this.checked['node' + node.node_seq] = node.executed === 'True' ? true : false;
    }
  }

  ngAfterViewInit() {
    (<any>$('.' + this.projectClass)).connections('remove');
    this.drawConnections();
    //redraw connector lines when div.limit resizes
    const that = this;
    $(".limit").each(function(){
      let resize_sensor = new ResizeSensor(this, function () {
        that.reDraw();
      })
     
    })

  }

  reDraw() {
    (<any>$('.' + this.projectClass)).connections('update');
  }
}
