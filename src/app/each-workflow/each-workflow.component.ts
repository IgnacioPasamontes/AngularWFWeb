import { Component, OnInit, Input, AfterViewInit, ElementRef } from '@angular/core';
declare var jQuery: any;
import { Globals } from '../globals';
import { INode } from '../node';

@Component({
  selector: 'app-each-workflow',
  templateUrl: './each-workflow.component.html',
  styleUrls: ['./each-workflow.component.css']
})
export class EachWorkflowComponent implements OnInit {

  @Input() projectName;
  
  workflow: { [id: string]: INode; }
  constructor(private el: ElementRef,public globals: Globals) { }

 ngOnInit() {

  const component = this;
   setTimeout(() => {
      const data = {
        "operators": {
          "operator1": {
            "top": 20,
            "left": 20,
            "properties": {
              "title": "Problem formulation",
              "info": "Problem formulation INFO",
              "parameters": "Problem formulation Parameters",
              "inputs": {},
              "outputs": {
                "output_1": {
                  "label": "OUT"
                },
                "output_2": {
                  "label": "ERROR"
                }
              },
              "executed":true
            }
          },
          "operator2": {
            "top": 20,
            "left": 300,
            "properties": {
              "title": "TC Characterization",
              "info":"TC Characterization INFO",
              "parameters": "TC Characterization Parameters",
              "inputs": {
                "input_1": {
                  "label": "IN",
                  "data":"Input Data"
                }
              },
              "outputs": {
                "output_1": {
                  "label": "OUT",
                  "data":"OutPut Data"
                },
                "output_2": {
                  "label": "ERROR",
                  "data":"OutPut Data"
                }
              },
              "source_input":{
                "input_1": {
                  "operator": "2",
                  "ouput":"Salida1"
                }
              },
              "executed":true
            }
          },
          "operator3": {
            "top": 20,
            "left": 620,
            "properties": {
              "title": "Metabolism data",
              "info": "Metabolism data INFO",
              "parameters": "Metabolism data Parameters",
              "inputs": {
                "input_1": {
                  "label": "IN"
                }
              },
              "outputs": {
                "output_1": {
                  "label": "OUT"
                },
                "output_2": {
                  "label": "ERROR"
                }
              },
              "executed":true
            }
          },
          "operator4": {
            "top": 20,
            "left": 980,
            "properties": {
              "title": "SCs identification",
              "info": "SCs identification INFO",
              "parameters": "SCs identification Parameters",
              "inputs": {
                "input_1": {
                  "label": "IN"
                },
                "input_2": {
                  "label": "IN2"
                }
              },
              "outputs": {
                "output_1": {
                  "label": "OUT"
                },
                "output_2": {
                  "label": "ERROR"
                }
              },
              "executed":true
            }
          },
          "operator5": {
            "top": 300,
            "left": 20,
            "properties": {
              "title": "SCs evaluation",
              "info": "SCs evaluation INFO",
              "parameters": "SCs evaluation Parameters",
              "inputs": {
                "input_1": {
                  "label": "IN"
                }
              },
              "outputs": {
                "output_1": {
                  "label": "OUT"
                },
                "output_2": {
                  "label": "ERROR"
                }
              },
              "executed":false
            }
          },
          "operator6": {
            "top": 300,
            "left": 280,
            "properties": {
              "title": "Enough information",
              "info":"Enough information INFO",
              "parameters": "Enough information  Parameters",
              "inputs": {
                "input_1": {
                  "label": "IN"
                }
              },
              "outputs": {
                "output_1": {
                  "label": "OUT"
                },
                "output_2": {
                  "label": "ERROR"
                }
              },
              "executed":false
            }
          },
          "operator7": {
            "top": 300,
            "left": 720,
            "properties": {
              "title": "RA hypothesis",
              "info": "RA hypothesis INFO",
              "parameters": "RA hypothesis  Parameters",
              "inputs": {
                "input_1": {
                  "label": "IN"
                }
              },
              "outputs": {
                "output_1": {
                  "label": "OUT"
                },
                "output_2": {
                  "label": "ERROR"
                }
              },
              "executed":false
            }
          }
        },
        "links": {
          "0": {
            "fromOperator": "operator1",
            "fromConnector": "output_1",
            "fromSubConnector": 0,
            "toOperator": "operator2",
            "toConnector": "input_1",
            "toSubConnector": 0
          },
          "1": {
            "fromOperator": "operator2",
            "fromConnector": "output_1",
            "fromSubConnector": 0,
            "toOperator": "operator3",
            "toConnector": "input_1",
            "toSubConnector": 0
          },
          "2": {
            "fromOperator": "operator3",
            "fromConnector": "output_1",
            "fromSubConnector": 0,
            "toOperator": "operator4",
            "toConnector": "input_1",
            "toSubConnector": 0
          },
          "3": {
            "fromOperator": "operator5",
            "fromConnector": "output_1",
            "fromSubConnector": 0,
            "toOperator": "operator6",
            "toConnector": "input_1",
            "toSubConnector": 0
          },
          "4": {
            "fromOperator": "operator6",
            "fromConnector": "output_1",
            "fromSubConnector": 0,
            "toOperator": "operator7",
            "toConnector": "input_1",
            "toSubConnector": 0
          },
          "5": {
            "fromOperator": "operator6",
            "fromConnector": "output_2",
            "fromSubConnector": 0,
            "toOperator": "operator4",
            "toConnector": "input_2",
            "toSubConnector": 0
          },
          "6": {
            "fromOperator": "operator4",
            "fromConnector": "output_1",
            "fromSubConnector": 0,
            "toOperator": "operator5",
            "toConnector": "input_1",
            "toSubConnector": 0
          }
        },
        "operatorTypes": {}
      }

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
    var data = jQuery(this.el.nativeElement).find("#"+this.projectName).flowchart('getOperatorData', operatorId);
    this.globals.actual_node = data.properties;
    this.globals.node_visible = false;
    
    var $element = jQuery(this.el.nativeElement).find("#"+this.projectName).flowchart('getOperatorElement', data);
   
    
  
    $element.find("i").css({'font-size:': '25px','color': 'green'});
    
    //console.log(JSON.stringify(data,null, 2));
  
   
  
   
    //this.globals.node_visible= this.globals.node_visible ? false : true;
  }
  nodeInfo_unselected(){
    this.globals.node_visible = true;
    //this.globals.node_visible= this.globals.node_visible ? false : true;
  }

}
