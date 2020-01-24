import { Component, Input, OnInit, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import { Globals } from '../globals';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResizeSensor } from 'css-element-queries';
import { EachWorkflowService } from '../each-workflow/each-workflow.service';
import { MatCheckboxModule } from '@angular/material/checkbox';


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

  in_vitro_data_check: boolean;

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
    'node18': false,
    'node19': false,
    'node20': false,
    'node21': false,
    'node22': false,
    'node23': false,
    'node24': false,
    'node25': false,
    'node26': false,
    'node27': false,
    'node28': false,
    'node29': false,
    'node30': false,
    'node31': false,
    'node32': false,
    'node33': false,
    'node34': false,

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

  inVitroDataCheckChange() {
    console.log('check:');
    console.log(this.in_vitro_data_check);
  }

  ngOnDestroy() {

    (<any>$('.' + this.projectClass)).connections('remove');
  }

  drawConnections() {
    (<any>$('.' + this.projectClass)).connections('remove');

    $('#' + this.projectClass + '_id_23, #' + this.projectClass + '_node_23_no').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_node_23_no, #' + this.projectClass + '_id_24').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_id_24, #' + this.projectClass + '_node_24_no').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_node_24_no, #' + this.projectClass + '_id_26').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_id_24, #' + this.projectClass + '_node_24_yes').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_node_24_yes, #' + this.projectClass + '_id_25').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_id_25, #' + this.projectClass + '_id_27').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_id_27, #' + this.projectClass + '_id_28').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_id_28, #' + this.projectClass + '_id_29').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_id_29, #' + this.projectClass + '_id_31').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_id_31, #' + this.projectClass + '_id_30').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_id_30, #' + this.projectClass + '_id_32').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_id_23, #' + this.projectClass + '_node_23_yes').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_node_23_yes, #' + this.projectClass + '_id_27').connections({
      class: 'fast'
    });
    /*$('#' + this.projectClass + '_id_24, #' + this.projectClass + '_id_27').connections({
      class: 'fast'
    });*/
    $('#' + this.projectClass + '_id_22, #' + this.projectClass + '_id_30').connections({
      class: 'fast'
    });
    $('#' + this.projectClass + '_id_26, #' + this.projectClass + '_id_27').connections({
      class: 'fast'
    });
  }

  async updateCheckedNodes() {
    let nodes_info;
    nodes_info = await this.eachworkflowservice.getProjectInfoSync(this.globals.current_user.projects[this.projectName]);

    for (const node of nodes_info) {
      this.checked['node' + node.node_seq] = node.executed === 'True' ? true : false;
    }
  }

  ngAfterViewInit() {
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
