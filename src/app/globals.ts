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
      {data: {id: '1', name: '1.Problem formulation', description: 'Problem formulation', weight: 300, height: 60, faveColor: '#FFB266', borderColor:'#FFB266', faveShape: 'rectangle', 
      input:[], output:'',comments:'',row: 0,col: 0}, group: 'nodes'},

      {data: {id: 'A', name: '', weight: 300, height: 250, faveColor: '#D8D8D8', borderColor:'#D8D8D8', faveShape: 'rectangle',
       input:[], output:'',comments:'', row: 1, col: 0}, group: 'nodes'},

      {data: {id: '2', name: '2.TC Characterization', parent:'A', description: 'TC Characterization', weight: 300, height: 60, faveColor: '#A5A5A5', borderColor:'#A5A5A5', faveShape: 'rectangle',
      input:[],output:'',comments:'', row: 2, col: 0}, group: 'nodes'},

      {data: {id: '3', name: 'Metabolism data gathering', parent:'A', description: 'Metabolism data', weight: 250, height: 60, faveColor: '#A5A5A5', borderColor:'#A5A5A5', faveShape: 'rectangle',
      input:[],output:'',comments:'', row: 3, col: 0}, group: 'nodes'},

      {data: {id: '4', name: 'Initial RAX hypothesis', parent:'A', description: 'Metabolism data', weight: 250, height: 60, faveColor: '#A5A5A5', borderColor:'#A5A5A5', faveShape: 'rectangle',
      input:[],output:'',comments:'', row: 4, col: 0}, group: 'nodes'},

      {data: {id: '5', name: '3.SCs identification', description: 'Cs identification', weight: 300, height: 60, faveColor: '#A5A5A5', borderColor:'#A5A5A5', faveShape: 'rectangle',
      input:[], output:'',comments:'', row: 5, col: 0}, group: 'nodes'},

      {data: {id: '6', name: '4.SCs evaluation', description: 'SCs evaluation', weight: 250, height: 60, faveColor: '#A5A5A5', borderColor:'#A5A5A5', faveShape: 'rectangle',
      input:[],output:'',comments:'',row: 6,col: 0}, group: 'nodes'},

      {data: {id: 'B', name: '', weight: 300, height: 250, faveColor: '#D8D8D8', borderColor:'#D8D8D8', faveShape: 'rectangle', 
      input:[], output:'',comments:'', row: 7, col: 0}, group: 'nodes'},

      {data: {id: '7', name: 'Overarching RAX hypothesis', parent:'B', description: 'Enough information', weight: 300, height: 60, faveColor: '#A5A5A5', borderColor:'#A5A5A5', faveShape: 'rectangle',
      input:[], output:'',comments:'', row: 8, col: 0}, group: 'nodes'},

      {data: {id: 'C', name: '', parent:'B', weight: 300, height: 50, faveColor: '#7030A0', borderColor:'#7030A0', faveShape: 'rectangle', 
      input:[], output:'',comments:'',row: 9, col: 0}, group: 'nodes'},

      {data: {id: '8', name: 'NAM testing and evatuation(in vitro & in silico)', parent:'C', description: '', weight: 250, height: 60, faveColor: '#7030A0', borderColor:'#7030A0', faveShape: 'rectangle',
      input:[], output:'',comments:'', row: 10, col: 0}, group: 'nodes'},

      {data: {id: '9', name: 'TK', description: 'RA hypothesis', parent:'C', weight: 250, height: 60, faveColor: '#7030A0', borderColor:'#FFFFFF', faveShape: 'rectangle',
      input:[], output:'',comments:'', row: 11, col: 0}, group: 'nodes'},

      {data: {id: '10', name: 'TD', description: 'RA hypothesis', parent:'C', weight: 250, height: 60, faveColor: '#7030A0', borderColor:'#FFFFFF', faveShape: 'rectangle',
      input:[], output:'',comments:'', row: 11, col: 1}, group: 'nodes'},

      {data: {id: '11', name: '5.Data gap filling', description: 'RA hypothesis 2', weight: 250, height: 60, faveColor: '#A5A5A5', borderColor:'#A5A5A5', faveShape: 'rectangle',
      input:[], output:'',comments:'', row: 12, col: 0}, group: 'nodes'},

      {data: {id: '12', name: '6.Uncertainty assessment', description: 'RA hypothesis 2', weight: 250, height: 60, faveColor: '#A5A5A5', borderColor:'#A5A5A5', faveShape: 'rectangle',
      input:[], output:'',comments:'', row: 13, col: 0}, group: 'nodes'}
    ],
    edges: [
      {data: {source: '1', target: '2', edgeColor: '#FFB266'}},
      {data: {source: '2', target: '3', edgeColor: '#A5A5A5'}},
      {data: {source: '3', target: '4', edgeColor: '#A5A5A5'}},

      {data: {source: '4', target: '5', edgeColor: '#A5A5A5'}},
      {data: {source: '5', target: '6', edgeColor: '#A5A5A5'}},

      {data: {source: '6', target: '7', edgeColor: '#A5A5A5'}},
      {data: {source: '7', target: '8', edgeColor: '#A5A5A5'}},
      {data: {source: '8', target: '9', edgeColor: '#A5A5A5'}},
      {data: {source: '8', target: '10', edgeColor: '#A5A5A5'}},
      {data: {source: '9', target: '11', edgeColor: '#A5A5A5'}},
      {data: {source: '10', target: '11', edgeColor: '#A5A5A5'}},
      {data: {source: '11', target: '12', edgeColor: '#A5A5A5'}},
      //{data: {source: '8', target: '2', edgeColor: '#A5A5A5'}}
    ]
  };
  cy:any =null;
}