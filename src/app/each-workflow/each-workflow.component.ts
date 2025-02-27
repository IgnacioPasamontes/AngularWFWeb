import { Component, OnInit, Input, AfterViewInit, OnDestroy , OnChanges, ViewChild} from '@angular/core';
/* @import '~@angular/cdk/overlay-prebuilt.css';*/ /*uncomment if @angular/material is not used */
import { Overlay } from '@angular/cdk/overlay';
import { Portal, ComponentPortal } from '@angular/cdk/portal'; 
import { Globals } from '../globals';
import { ModalDialogService } from 'ngx-modal-dialog';
import { NodeInfoComponent } from '../node-info/node-info.component';
import { NodeInfoService } from '../node-info/node-info.service';
import { OverlayComponent } from '../overlay/overlay.component';
import { Node1ProblemFormulationComponent } from '../node1-problem-formulation/node1-problem-formulation.component';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';
import { EachWorkflowService } from './each-workflow.service';
import { TabsService } from '../tabs/tabs.service';
import { CkEditor } from '../ckeditor';
//import * as ClassicEditor from '../../assets/js/ckeditor5/ckeditor.js';
import { ResizeSensor } from 'css-element-queries';

declare var $: JQueryStatic;
//declare var resizeSensor: any;

@Component({
  selector: 'app-each-workflow',
  templateUrl: './each-workflow.component.html',
  styleUrls: ['./each-workflow.component.css']
})

export class EachWorkflowComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input() projectName;
  @Input() redraw: boolean;
  @Input() visibleProject: string;
  @Input() change: boolean;
  @Input() resize_redraw: boolean;
  @Input() workflow_resize_update: boolean;
  @Input() workflow_resize_start: boolean;

  display = 'none';
  connectors: boolean = false;
  overlayPortal: ComponentPortal<any> = new ComponentPortal(OverlayComponent); 
  overlayRef: any;
  show_titles: boolean = true;
  
  

  public Editor: any;

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
  };


  constructor(public globals: Globals,
    private ckeditor: CkEditor,
    private dialog: MatDialog,
    private node: NodeInfoService,
    private tabs: TabsService,
    private service: EachWorkflowService,
    public overlay: Overlay) { }


  ngOnInit() {
    this.Editor = this.ckeditor.ClassicEditor;
    this.updateCheckedNodes();
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
  ngOnDestroy() {
    (<any>$('.' + this.projectName)).connections('remove');
  }


  updateCheckedNodes() {
    let nodes_info;
    let subscription = this.service.getProjectInfo(this.globals.current_user.projects[this.projectName]).subscribe( nodes_info => {
        (<any>nodes_info).forEach( (node) => {
          this.checked['node' + node['node_seq']] = node['executed'] === 'True' ? true : false;
        })
      },
      error => {subscription.unsubscribe(); },
      () => {subscription.unsubscribe(); }
    );
  }

  removeConnections(resize_clone: boolean = false, hard: boolean = false) {
    let jquery_selector_prefix: string = "body ";
    if (resize_clone) {
      jquery_selector_prefix = ":not(.resize-active) ";
    }
    (<any>$(jquery_selector_prefix).find('.' + this.projectName)).connections('remove');
    if (hard) {
      $(jquery_selector_prefix).find('#' + this.projectName + '_workflow connection').remove();
    }
    
  }

  drawConnections(resize_clone: boolean = false) {
    if (!this.connectors) { return };
    let jquery_selector_prefix: string = "body ";
    if (resize_clone) {
      jquery_selector_prefix = ":not(.resize-active) ";
    }

    setTimeout(() => {
      (<any>$(jquery_selector_prefix).find('.' + this.projectName)).connections('remove');
      (<any>$(jquery_selector_prefix).find('#' + this.projectName + '_id_1, #' + this.projectName + '_id_2')).connections({
        class: 'fast',
        within: jquery_selector_prefix + '#' + this.projectName + '_workflow',
      });
      (<any>$(jquery_selector_prefix).find('#' + this.projectName + '_id_2, #' + this.projectName + '_id_3')).connections({
        class: 'fast',
        within: jquery_selector_prefix + '#' + this.projectName + '_workflow',
      });
      (<any>$(jquery_selector_prefix).find('#' + this.projectName + '_id_3, #' + this.projectName + '_id_4')).connections({
        class: 'fast',
        within: jquery_selector_prefix + '#' + this.projectName + '_workflow',
      });
      (<any>$(jquery_selector_prefix).find('#' + this.projectName + '_id_4, #' + this.projectName + '_id_5')).connections({
        class: 'fast',
        within: jquery_selector_prefix + '#' + this.projectName + '_workflow',
      });
      (<any>$(jquery_selector_prefix).find('#' + this.projectName + '_id_5, #' + this.projectName + '_id_6')).connections({
        class: 'fast',
        within: jquery_selector_prefix + '#' + this.projectName + '_workflow',
      });
      (<any>$(jquery_selector_prefix).find('#' + this.projectName + '_id_6, #' + this.projectName + '_id_7')).connections({
        class: 'fast',
        within: jquery_selector_prefix + '#' + this.projectName + '_workflow',
      });
      (<any>$(jquery_selector_prefix).find('#' + this.projectName + '_id_7, #' + this.projectName + '_id_8')).connections({
        class: 'fast',
        within: jquery_selector_prefix + '#' + this.projectName + '_workflow',
      });
      (<any>$(jquery_selector_prefix).find('#' + this.projectName + '_id_9')).connections({
        from: '#' + this.projectName + '_id_8',
        class: 'fast',
        within: jquery_selector_prefix + '#' + this.projectName + '_workflow',
      });
      (<any>$(jquery_selector_prefix).find('#' + this.projectName + '_id_10')).connections({
        from: '#' + this.projectName + '_id_8',
        class: 'fast',
        within: jquery_selector_prefix + '#' + this.projectName + '_workflow',
      });
      (<any>$(jquery_selector_prefix).find('#' + this.projectName + '_id_11')).connections({
        from: '#' + this.projectName + '_id_9',
        class: 'fast',
        within: jquery_selector_prefix + '#' + this.projectName + '_workflow',
      });
      (<any>$(jquery_selector_prefix).find('#' + this.projectName + '_id_11')).connections({
        from: '#' + this.projectName + '_id_10',
        class: 'fast',
        within: jquery_selector_prefix + '#' + this.projectName + '_workflow',
      });
      (<any>$(jquery_selector_prefix).find('#' + this.projectName + '_id_11, #' + this.projectName + '_id_12')).connections({
        class: 'fast',
        within: jquery_selector_prefix + '#' + this.projectName + '_workflow',
      });
      (<any>$(jquery_selector_prefix).find('#' + this.projectName + '_id_12, #' + this.projectName + '_id_13')).connections({
        class: 'fast',
        within: jquery_selector_prefix + '#' + this.projectName + '_workflow',
      });
    }, 0);
  }

  ngAfterViewInit() {
    this.drawConnections();
    
    //redraw connector lines when div.limit resizes
    const that = this;
    const limit = $(".limit");
    limit.each(function() {
      let resize_sensor = new ResizeSensor(this, function () {
        that.reDraw();
        if (limit.width() < 315) {
          that.show_titles = false;
        } else {
          that.show_titles = true;
        }
      });
     
    })

    //redraw connector lines when window size changes
    /*$(window).resize(function() {
      that.reDraw();
    });*/
    
  

    //redraw connector every 200 ms    
    /*setInterval(function() {
      this.reDraw();
    }.bind(this), 200);*/
  }


  launchNode(project_id:any, result: any, node_seq: number, node_loading_overlayRef: any) {
    result['node_seq'] = node_seq;
    if (!this.globals.node_csrf_token.hasOwnProperty(project_id)) {
      this.globals.node_csrf_token[project_id] = {} ;
    }
    if (result.hasOwnProperty('CSRF_TOKEN')) {
      this.globals.node_csrf_token[project_id][node_seq] = result.CSRF_TOKEN;
    } else {
      this.globals.node_csrf_token[project_id][node_seq] = null;
    }
    const add_molecule_icon_path = this.globals.add_molecule_icon_path; 
    const subs2 = this.service.getAssetFileAsText(add_molecule_icon_path).subscribe(
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
        subs2.unsubscribe();
      },
      error => {
        node_loading_overlayRef.dispose();
        alert('Error: file "/assets/'+add_molecule_icon_path+'" not found.');
        subs2.unsubscribe();
      }
    );
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
    
    const subs = this.service.getNodeInfo(project_id, node_seq).subscribe(
      result => {
        this.launchNode(project_id,result,node_seq,node_loading_overlayRef);
        subs.unsubscribe();
      },
      error => {
        console.log(error);
        if (error.status === 404 && error.error['Reason'] === 'Node not found.') {
          const result = error.error;
          delete result['Reason'];
          this.launchNode(project_id,result,node_seq,node_loading_overlayRef);
        } else {
          node_loading_overlayRef.dispose();
          alert('Error getting node');
        }
        subs.unsubscribe();
      }
    );
  }

  reDraw() {
    (<any>$('.' + this.projectName)).connections('update');
  }


  openTD() {
    const td_projectName = this.projectName + this.globals.td_project_suffix;
    (<any>$('.card')).connections('remove');
    this.tabs.openProject(td_projectName);
  }

  openTK() {
    const tk_projectName = this.projectName + this.globals.tk_project_suffix;
    (<any>$('.card')).connections('remove');
    this.tabs.openProject(tk_projectName);
  }

}
