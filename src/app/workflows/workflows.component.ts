import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';

declare var RegExpEscape: any;

@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.css']
})
export class WorkflowsComponent implements OnInit {

  subproject_suffix_separator_pattern : RegExp;
  
  constructor(public globals: Globals) { }

  ngOnInit() {
    this.subproject_suffix_separator_pattern = new RegExp('^.*'+RegExpEscape(this.globals.subproject_suffix_separator));

  }
}
