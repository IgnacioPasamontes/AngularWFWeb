import { Component, Input, OnInit, OnChanges, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Globals } from '../globals';
import { Overlay } from '@angular/cdk/overlay';
import { Portal, ComponentPortal } from '@angular/cdk/portal'; 
import { NodeInfoComponent } from '../node-info/node-info.component';
import { NodeInfoService } from '../node-info/node-info.service';
import { OverlayComponent } from '../overlay/overlay.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as ClassicEditor from '../../assets/js/ckeditor5/ckeditor.js';
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
  mainProjectName: string;
  overlayPortal: ComponentPortal<any> = new ComponentPortal(OverlayComponent); 

  public Editor = ClassicEditor;

  checked = {
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
  };

  constructor(public globals: Globals,
              private dialog: MatDialog,
              private node: NodeInfoService,
              public overlay: Overlay,
              private eachworkflowservice: EachWorkflowService) { }

  ngOnInit() {
    this.mainProjectName = this.projectName.replace(
      new RegExp(this.globals.subproject_suffix_separator+'.*$'),
      ''
    );
    const tk_class_name = this.projectName.replace(
      new RegExp(RegExpEscape(this.globals.tk_project_suffix)+'$'),
      this.globals.tk_class_suffix
    )
    this.projectClass = tk_class_name; //also used for IDs

    this.updateCheckedNodes();
  }

  ngOnChanges (changes) {
    if (this.visibleProject !== '') {
      if (this.projectName === this.visibleProject) {
        if (changes.hasOwnProperty('visibleProject')) {
          this.drawConnections();
        }
        if (changes.hasOwnProperty('change')) {
          this.updateCheckedNodes();
        }
      }
    }
  }


  ngOnDestroy() {

    (<any>$('.' + this.projectClass)).connections('remove');
  }

  updateCheckedNodes() {
    let nodes_info;
    let subscription = this.eachworkflowservice.getProjectInfo(this.globals.current_user.projects[this.mainProjectName]).subscribe( nodes_info => {
        (<any>nodes_info).forEach( (node) => {
          this.checked['node' + node['node_seq']] = node['executed'] === 'True' ? true : false;
        })
      },
      error => {},
      () => {subscription.unsubscribe();}
    );
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

  nodeInfo_selected(project: string, node_seq: number) {
    let node_loading_overlayRef = this.overlay.create({
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.block()
    });
    node_loading_overlayRef.attach(this.overlayPortal);
    const project_id = this.globals.current_user.projects[project]; // GET ID PROJECT
    let busy = this.node.getNodeBusy(project_id, node_seq);

    if (busy) {
      node_loading_overlayRef.dispose();
      return;
    }
    
    this.eachworkflowservice.getNodeInfo(project_id, node_seq).subscribe(
      result => {
        result['node_seq'] = node_seq;
        if (!this.globals.node_csrf_token.hasOwnProperty(project_id)) {
          this.globals.node_csrf_token[project_id] = {} ;
        }
        if (result.hasOwnProperty('CSRF_TOKEN')) {
          this.globals.node_csrf_token[project_id][node_seq] = result.CSRF_TOKEN;
        } else {
          this.globals.node_csrf_token[project_id][node_seq] = null;
        }
        const add_molecule_icon_path = 'icons/ckeditor5-custom-element-molecule/benzene-147550.svg'; 
        this.eachworkflowservice.getAssetFileAsText(add_molecule_icon_path).subscribe(
          result_file_text => {
            result['add_molecule_icon'] = result_file_text;
            const dialogRef: MatDialogRef<any> = this.dialog.open( NodeInfoComponent, {
              width: '100%',
              data: result,
            });
            dialogRef.afterOpened().subscribe(() => { node_loading_overlayRef.dispose(); });
            dialogRef.afterClosed().subscribe(result => {
              if (result === 'cancel' || result == undefined) {
                this.node.setNodeAsBusy(project_id, node_seq,false);
              } else if (result === 'OK') {
                this.node.setNodeAsBusy(project_id, node_seq);
              }
            });
          },
          error => {
            node_loading_overlayRef.dispose();
            alert('Error: file "/assets/'+add_molecule_icon_path+'" not found.');
            
          });
      },
      error => {
        node_loading_overlayRef.dispose();
        alert('Error getting node');
      }
    );
  }



  reDraw() {
    (<any>$('.' + this.projectClass)).connections('update');
  }
}
