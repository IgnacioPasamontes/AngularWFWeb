import { Injectable } from '@angular/core';
import { User } from './user'
import { INode } from './node'
@Injectable()
export class Globals {
  projects: Array<string> = ["Project1","Project2","Project3"];
  users:{ [id: string] : User } = {
    "ignacio.pasamontes@gmail.com":{
    name: "Ignacio Pasamontes Fúnez",
    password: "nacho",
    projects: ["Read_Across","Prediction","Analytic"]
    },
    "pepe@gmail.com":{
      name: "Pepe",
      password: "pepe",
      projects: ["Project","ProjectPepe2","ProjectPepe3"]
    }
  }
  actual_user:User;
  active_projects : Array<string>=["New_Project"]
  node_visible:boolean=true;
  operatorId:string="";
  actual_node: INode;
  _graphData: any = {
    nodes: [
      {data: {
              id: '1', name: '1.Problem formulation', description: 'Insert in this step a detailled description of the study objectives and expected outcomes',
              resources:[
                {name:'Name Link 1',link:'https://www.google.com/'},
                {name:'Name Link 2',link:'https://www.google.com/'},
                {name:'Name Link 3',link:'https://www.google.com/'},
                {name:'Name Link 4',link:'https://www.google.com/'},
                {name:'Name Link 5',link:'https://www.google.com/'},
              ], 
              faveColor: '#FFB266', borderColor:'#FFB266', faveShape: 'rectangle', 
              input:[], output:'',comments:'',
              weight: 300, height: 60, 
              row: 0,col: 0},
              group: 'nodes'
            },

      {
        data: {
                id: 'A', name: '', description: '',
                resources:[], 
                faveColor: '#D8D8D8', borderColor:'#D8D8D8', faveShape: 'rectangle',
                input:[], output:'',comments:'',
                weight: 300, height: 250,
                row: 1, col: 0}, 
                group: 'nodes'
            },

      {
        data: {
                id: '2', name: '2.TC Characterization', description: 'TC Characterization',
                resources:[],
                parent:'A',
                faveColor: '#A5A5A5', borderColor:'#A5A5A5', faveShape: 'rectangle',   
                input:[],output:'',comments:'', 
                weight: 300, height: 60, 
                row: 2, col: 0}, 
                group: 'nodes'
            },

      {
        data: {
                id: '3', name: 'Metabolism data gathering', description: 'Metabolism data',
                resources:[],
                parent:'A',
                faveColor: '#A5A5A5', borderColor:'#A5A5A5', faveShape: 'rectangle',
                input:[],output:'',comments:'',
                weight: 250, height: 60,
                row: 3, col: 0},
                group: 'nodes'
            },

      {
        data: {
                id: '4', name: 'Initial RAX hypothesis', description: 'Metabolism data',
                resources:[],
                parent:'A', 
                faveColor: '#A5A5A5', borderColor:'#A5A5A5', faveShape: 'rectangle',
                input:[],output:'',comments:'',
                weight: 250, height: 60,
                row: 4, col: 0}, 
                group: 'nodes'
            },

      {
        data: {
                id: '5', name: '3.SCs identification', description: 'Cs identification', 
                resources:[],
                faveColor: '#A5A5A5', borderColor:'#A5A5A5', faveShape: 'rectangle',
                input:[], output:'',comments:'',
                weight: 300, height: 60,  
                row: 5, col: 0}, 
                group: 'nodes'
            },

      {
        data: {
                id: '6', name: '4.SCs evaluation', description: 'SCs evaluation',
                resources:[],
                faveColor: '#A5A5A5', borderColor:'#A5A5A5', faveShape: 'rectangle',
                input:[],output:'',comments:'',
                weight: 250, height: 60,
                row: 6,col: 0}, 
                group: 'nodes'
            },

      {data: {
                id: 'B', name: '', description: '',
                resources:[], 
                faveColor: '#D8D8D8', borderColor:'#D8D8D8', faveShape: 'rectangle', 
                input:[], output:'',comments:'', 
                weight: 300, height: 250, 
                row: 7, col: 0}, 
                group: 'nodes'
            },

      {
        data: {
              id: '7', name: 'Overarching RAX hypothesis', description: 'Enough information',
              resources:[],
              parent:'B', 
              faveColor: '#A5A5A5', borderColor:'#A5A5A5', faveShape: 'rectangle',
              input:[], output:'',comments:'',
              weight: 300, height: 60, 
              row: 8, col: 0}, 
              group: 'nodes'
            },

      {
        data: {id: 'C', name: '', description: '',
              resources:[], 
              parent:'B',
              faveColor: '#7030A0', borderColor:'#7030A0', faveShape: 'rectangle', 
              input:[], output:'',comments:'', 
              weight: 300, height: 50, 
              row: 9, col: 0}, 
              group: 'nodes'
            },

      {
        data: {id: '8', name: 'NAM testing and evatuation(in vitro & in silico)', description: '',
              resources:[],
              parent:'C',
              faveColor: '#A5A5A5', borderColor:'#FFFFFF', faveShape: 'rectangle',
              input:[], output:'',comments:'',
              weight: 450, height: 60,  
              row: 10, col: 0}, 
              group: 'nodes'
            },

      {
        data: {id: '9', name: 'TK', description: 'RA hypothesis',
              resources:[], 
              parent:'C',
              faveColor: '#A5A5A5', borderColor:'#FFFFFF', faveShape: 'rectangle',
              input:[], output:'',comments:'', 
              weight: 250, height: 60,  
              row: 11, col: 0}, 
              group: 'nodes'
            },

      {
        data: {id: '10', name: 'TD', description: 'RA hypothesis',
              resources:[], 
              parent:'C',
              faveColor: '#A5A5A5', borderColor:'#FFFFFF', faveShape: 'rectangle',
              input:[], output:'',comments:'', 
              weight: 250, height: 60,  
              row: 11, col: 1}, 
              group: 'nodes'
            },

      {
        data: {id: '11', name: '5.Data gap filling', description: 'RA hypothesis 2',
              resources:[], 
              faveColor: '#A5A5A5', borderColor:'#A5A5A5', faveShape: 'rectangle',
              input:[], output:'',comments:'', 
              weight: 250, height: 60, 
              row: 12, col: 0}, 
              group: 'nodes'},

      {
        data: {id: '12', name: '6.Uncertainty assessment', description: 'RA hypothesis 2',
              resources:[],
              faveColor: '#A5A5A5', borderColor:'#A5A5A5', faveShape: 'rectangle',
               input:[], output:'',comments:'',
               weight: 250, height: 60,  
               row: 13, col: 0}, 
               group: 'nodes'
            }
    ],
    edges: [
      {data: {source: '1', target: '2', edgeColor: '#FFB266'}},
      {data: {source: '2', target: '3', edgeColor: '#FFB266'}},
      {data: {source: '3', target: '4', edgeColor: '#FFB266'}},

      {data: {source: '4', target: '5', edgeColor: '#FFB266'}},
      {data: {source: '5', target: '6', edgeColor: '#FFB266'}},

      {data: {source: '6', target: '7', edgeColor: '#FFB266'}},
      {data: {source: '7', target: '8', edgeColor: '#FFB266'}},
      {data: {source: '8', target: '9', edgeColor: '#FFB266'}},
      {data: {source: '8', target: '10', edgeColor: '#FFB266'}},
      {data: {source: '9', target: '11', edgeColor: '#FFB266'}},
      {data: {source: '10', target: '11', edgeColor: '#FFB266'}},
      {data: {source: '11', target: '12', edgeColor: '#FFB266'}},

    ]
  };
  cy:any =null;
}