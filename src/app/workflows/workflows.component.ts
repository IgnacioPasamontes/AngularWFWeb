import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Globals } from '../globals';

declare var RegExpEscape: any;

@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.css']
})
export class WorkflowsComponent implements OnInit, OnChanges {

  redraw_workflow: boolean = false;
  resize_redraw: boolean = false;
  subproject_suffix_separator_pattern: RegExp;
  @Input() redraw: boolean;
  @Input() workflow_resize_start: boolean;
  @Input() workflow_resize_update: boolean;

  
  constructor(public globals: Globals) { }

  ngOnInit() {
    this.subproject_suffix_separator_pattern = new RegExp('^.*'+RegExpEscape(this.globals.subproject_suffix_separator));

  }


  triggerWorkflowRedraw() {
    this.redraw_workflow = !this.redraw_workflow;
    this.globals.workflow_scroll = !this.globals.workflow_scroll;
  }

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('redraw')) {
      this.resize_redraw = !this.resize_redraw;
    }
  }
}
