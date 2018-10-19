import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Globals } from '../globals';
import {} from 'jq'

@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.css']
})
export class WorkflowsComponent implements AfterViewInit {
  @ViewChild('workflow') wf: ElementRef;

  constructor( public globals: Globals) { }

  ngAfterViewInit() {

    var data = {
      operators: {
        operator1: {
          top: 20,
          left: 20,
          properties: {
            title: 'Operator 1',
            inputs: {},
            outputs: {
              output_1: {
                label: 'Output 1',
              }
            }
          }
        },
        operator2: {
          top: 80,
          left: 300,
          properties: {
            title: 'Operator 2',
            inputs: {
              input_1: {
                label: 'Input 1',
              },
              input_2: {
                label: 'Input 2',
              },
            },
            outputs: {}
          }
        },
      }
    };

    setTimeout(() => {
      // Apply the plugin on a standard, empty div...
      
      console.log(this.wf)
      alert(this.wf.nativeElement)
      this.wf.nativeElement.flowchart({
        data: data,
        // allows multiple links on the same output line34
        multipleLinksOnInput: true,
        // allows multiple links on the same input line
        multipleLinksOnOutput: true
        
      });
    },
    2000);
    

    
  }

}
