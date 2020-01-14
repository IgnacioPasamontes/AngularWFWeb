import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Globals } from '../globals';

@Component({
  selector: 'app-tk-workflow',
  templateUrl: './tk-workflow.component.html',
  styleUrls: ['./tk-workflow.component.css']
})
export class TkWorkflowComponent implements OnInit, AfterViewInit {

  constructor(public globals: Globals) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    $('.card').connections('remove');

  }
}
