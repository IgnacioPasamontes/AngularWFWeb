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
  flowchart:any;
  container:any;

  items = [
    {name: "Apple", type: "fruit"},
    {name: "Carrot", type: "vegetable"},
    {name: "Orange", type: "fruit"}
      ];
  droppedItems:Array<any>;
  
  workflow: { [id: string]: INode; }
  constructor(private el: ElementRef,public globals: Globals) { }

 ngOnInit() {

  this.droppedItems=[]

  const component = this;
   setTimeout(() => {

     const data = {}
     /* const data = {
        "operators": {
          "operator1": {
            "top": 20,
            "left": 20,
            "properties": {
              "id": "operator1",
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
              "executed":false
            }
          },
          "operator2": {
            "top": 20,
            "left": 300,
            "properties": {
              "id": "operator2",
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
              "executed":false
            }
          },
          "operator3": {   
            "top": 20,
            "left": 620,
            "properties": {
              "id": "operator3",
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
              "executed":false
            }
          },
          "operator4": {  
            "top": 20,
            "left": 980,
            "properties": {
              "id": "operator4",
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
              "executed":false
            }
          },
          "operator5": {  
            "top": 300,
            "left": 20,
            "properties": {
              "id": "operator5",
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
              "id": "operator6",
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
              "id": "operator7",
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
      }*/
      this.flowchart = jQuery(this.el.nativeElement).find("#"+this.projectName);
      this.container = this.flowchart.parent();
      //console.log(jQuery(this.el.nativeElement).find("#example"))
     // alert(jQuery(this.el.nativeElement).find("#example"))
     this.flowchart.flowchart({
        data: data,
        linkWidth:5,
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
        },
        onLinkCreate:function (linkID,linkData){
          console.log(linkData)
          alert("LinkID: "+linkID)
          return true
        }
        
      });
    },
    10);
  }
  nodeInfo_selected(operatorId){

    var data = this.flowchart.flowchart('getOperatorData', operatorId);
    this.globals.actual_node = data.properties;
    this.globals.node_visible = false;
    //this.globals.node_visible= this.globals.node_visible ? false : true;

  }
  nodeInfo_unselected(){
    this.globals.node_visible = true;
    //this.globals.node_visible= this.globals.node_visible ? false : true;
  }

 
    
  onItemDrop2(e: any) {
    // Get the dropped data here
    console.log(e.dragData)
    this.droppedItems.push(e.dragData);
    alert(e.dragData.name)
  }
  onItemDrop(e: any) {
    // Get the dropped data here
    var elOffset = e.nativeEvent;
    var containerOffset = this.container.offset();
    if (elOffset.clientX > containerOffset.left && 
      elOffset.clientY > containerOffset.top && 
      elOffset.clientX < containerOffset.left + this.container.width() &&
      elOffset.clientY < containerOffset.top + this.container.height()) {

      var flowchartOffset = this.flowchart.offset();

      var relativeLeft = elOffset.clientX - flowchartOffset.left;
      var relativeTop = elOffset.clientY - flowchartOffset.top;
      var positionRatio = this.flowchart.flowchart('getPositionRatio');
      relativeLeft /= positionRatio;
      relativeTop /= positionRatio;
      
      //var data = getOperatorData($this);
      var data = { 
        top: 20,
        left: 20,
        properties: {
          title: 'Operator',
          inputs: {
            input_1: {
              label: 'IN',
            }
          },
          outputs: {
            output_1: {
              label: 'OUT',
            },
            output_2: {
              label: 'OUT2',
            }
          }        
        }
      }

      data.left = relativeLeft;
      data.top = relativeTop;
      
      this.flowchart.flowchart('addOperator', data);
  
    }
  }
}
  
