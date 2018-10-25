import { Component, OnInit, Input, AfterViewInit, ElementRef } from '@angular/core';
declare var jQuery: any;
import { Globals } from '../globals';

@Component({
  selector: 'app-each-workflow',
  templateUrl: './each-workflow.component.html',
  styleUrls: ['./each-workflow.component.css']
})
export class EachWorkflowComponent implements OnInit {

  @Input() projectName;

  constructor(private el: ElementRef,public globals: Globals) { }

 ngOnInit() {

  const component = this;
   setTimeout(() => {
      const data = {
        operators: {
          operator1: {
            top: 20,
            left: 20,
            properties: {
              title: 'Read SDF',
              inputs: {},
              outputs: {
                output_1: {
                  label: 'OUT',
                },
                output_2: {
                  label: 'ERROR',
                }
              }
            }
          },
          operator2: {
            top: 80,
            left: 300,
            properties: {
              title: 'Descriptors',
              inputs: {
                input_1: {
                  label: 'IN',
                }
              },
              outputs: {}
            }
          },
        }
      };

      //console.log(jQuery(this.el.nativeElement).find("#example"))
     // alert(jQuery(this.el.nativeElement).find("#example"))
      jQuery(this.el.nativeElement).find("#"+this.projectName).flowchart({
        data: data,
        linkWidth:2,
        // allows multiple links on the same output line34
        multipleLinksOnInput: true,
        // allows multiple links on the same input line
        multipleLinksOnOutput: true,
        onOperatorSelect: function(operatorId) {
          component.nodeInfo_selected(operatorId)
          return true;
        },
        onOperatorUnselect: function() {
          component.nodeInfo_unselected()
          return true
        } 
        
      });
    },
    10);


  }

  nodeInfo_selected(operatorId){
  
    this.globals.node_visible = false; 
    //this.globals.node_visible= this.globals.node_visible ? false : true;
  }
  nodeInfo_unselected(){
   
    this.globals.node_visible = true;
    //this.globals.node_visible= this.globals.node_visible ? false : true;
  }

}
