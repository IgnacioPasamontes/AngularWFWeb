import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Globals } from '../globals';

@Component({
  selector: 'app-td-workflow',
  templateUrl: './td-workflow.component.html',
  styleUrls: ['./td-workflow.component.css']
})
export class TdWorkflowComponent implements OnInit, AfterViewInit {

  constructor(public globals: Globals) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    $('.card').connections('remove');
  }
}
