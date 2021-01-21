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

declare var RegExpEscape: any;
declare var $;

@Component({
  selector: 'app-td-workflow',
  templateUrl: './td-workflow.component.html',
  styleUrls: ['./td-workflow.component.css']
})
export class TdWorkflowComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @Input() projectName;
  @Input() redraw: boolean;
  @Input() visibleProject: string;
  @Input() change: boolean;
  @Input() resize_redraw: boolean;
  @Input() workflow_resize_start: boolean;

  public Editor = ClassicEditor;

  mainProjectName: string;
  projectClass: string; //also used for IDs
  overlayPortal: ComponentPortal<any> = new ComponentPortal(OverlayComponent); 


  checked = {
    'node13': false,
    'node14': false,
    'node15': false,
    'node16': false,
    'node17': false,
    'node18': false,
    'node19': false,
    'node20': false,
    'node21': false,
  };

  constructor(public globals: Globals,
              private dialog: MatDialog,
              private node: NodeInfoService,
              public overlay: Overlay,
              private eachworkflowservice: EachWorkflowService,
              ) { }

  ngOnInit() {
    this.mainProjectName = this.projectName.replace(
      new RegExp(this.globals.subproject_suffix_separator+'.*$'),
      ''
    );
    const td_class_name = this.projectName.replace(
      new RegExp(RegExpEscape(this.globals.td_project_suffix)+'$'),
      this.globals.td_class_suffix
    )

    this.projectClass = td_class_name; //also used for IDs

    //this.updateCheckedNodes();
  }

  ngOnChanges (changes) {
    if (this.visibleProject !== '') {
      if (this.projectName === this.visibleProject) {
        
        if (changes.hasOwnProperty('visibleProject') || changes.hasOwnProperty('redraw')) {
          this.drawConnections();
        }
        if (changes.hasOwnProperty('resize_redraw')) {
            this.removeConnections();
            this.drawConnections();

        }
        if (changes.hasOwnProperty('change')) {
          this.updateCheckedNodes();
        }
        if (changes.hasOwnProperty('workflow_resize_start')) {
          this.removeConnections(true, true);
        }
        if (changes.hasOwnProperty('workflow_resize_update')) {
          this.removeConnections(true, true);
          this.drawConnections(true);
        }
      }
    }
  }

  removeConnections(resize_clone: boolean = false, hard: boolean = false) {
    let jquery_selector_prefix: string = "body ";
    if (resize_clone) {
      jquery_selector_prefix = ":not(.resize-active) ";
    }
    (<any>$(jquery_selector_prefix).find('.' + this.projectClass)).connections('remove');
    if (hard) {
      $(jquery_selector_prefix).find('#' + this.projectClass + '_workflow connection').remove();
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

  drawConnections(resize_clone: boolean = false) {
    let jquery_selector_prefix: string = "body ";
    if (resize_clone) {
      jquery_selector_prefix = ":not(.resize-active) ";
    }
    setTimeout(() => {

    (<any>$(jquery_selector_prefix).find('.' + this.projectClass)).connections('remove');

    $(jquery_selector_prefix).find('#' + this.projectClass + '_id_13, #' + this.projectClass + '_id_16').connections({
      class: 'fast',
      within: jquery_selector_prefix + '#' + this.projectClass + '_workflow',
    });
    $(jquery_selector_prefix).find('#' + this.projectClass + '_id_14, #' + this.projectClass + '_id_17').connections({
      class: 'fast',
      within: jquery_selector_prefix + '#' + this.projectClass + '_workflow',
    });
    $(jquery_selector_prefix).find('#' + this.projectClass + '_id_15, #' + this.projectClass + '_id_18').connections({
      class: 'fast',
      within: jquery_selector_prefix + '#' + this.projectClass + '_workflow',
    });
    $(jquery_selector_prefix).find('#' + this.projectClass + '_id_16, #' + this.projectClass + '_id_19').connections({
      class: 'fast',
      within: jquery_selector_prefix + '#' + this.projectClass + '_workflow',
    });
    $(jquery_selector_prefix).find('#' + this.projectClass + '_id_17, #' + this.projectClass + '_id_19').connections({
      class: 'fast',
      within: jquery_selector_prefix + '#' + this.projectClass + '_workflow',
    });
    $(jquery_selector_prefix).find('#' + this.projectClass + '_id_18, #' + this.projectClass + '_id_20').connections({
      class: 'fast',
      within: jquery_selector_prefix + '#' + this.projectClass + '_workflow',
    });
    $(jquery_selector_prefix).find('#' + this.projectClass + '_id_20, #' + this.projectClass + '_id_21').connections({
      class: 'fast',
      within: jquery_selector_prefix + '#' + this.projectClass + '_workflow',
    });

    
    /*$(jquery_selector_prefix).find('#' + this.projectClass + '_id_20, #' + this.projectClass + '_id_13').connections({
      class: 'fast',
      within: jquery_selector_prefix + '#' + this.projectClass + '_workflow',
    });
    $(jquery_selector_prefix).find('#' + this.projectClass + '_id_20, #' + this.projectClass + '_id_14').connections({
      class: 'fast',
      within: jquery_selector_prefix + '#' + this.projectClass + '_workflow',
    });*/
    }, 0);
  }

  ngAfterViewInit() {
    this.updateCheckedNodes();
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
              hasBackdrop: true,
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
