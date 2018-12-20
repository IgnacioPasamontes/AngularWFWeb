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
      {data: {id: '1', name: 'Problem formulation', weight: 300, faveColor: '#FF0000', faveShape: 'rectangle', input:[], output:[{Dummy:'empty'}] }},
      {data: {id: '2', name: 'TC Characterization', weight: 300, faveColor: '#FF0000', faveShape: 'rectangle', input:[], output:[]}},
      {data: {id: '3', name: 'Metabolism data', weight: 250, faveColor: '#FF0000', faveShape: 'rectangle', input:[], output:[]}},
      {data: {id: '4', name: 'SCs identification', weight: 300, faveColor: '#FF0000', faveShape: 'rectangle', input:[], output:[]}},
      {data: {id: '5', name: 'SCs evaluation', weight: 250, faveColor: '#FF0000', faveShape: 'rectangle', input:[], output:[]}},
      {data: {id: '6', name: 'Enough information', weight: 300, faveColor: '#FF0000', faveShape: 'rectangle', input:[], output:[]}},
      {data: {id: '7', name: 'RA hypothesis', weight: 250, faveColor: '#FF0000', faveShape: 'rectangle', input:[], output:[]}},
      {data: {id: '8', name: 'RA hypothesis 2', weight: 250, faveColor: '#FF0000', faveShape: 'rectangle', input:[], output:[]}}
    ],
    edges: [
      {data: {source: '1', target: '2', faveColor: '#6FB1FC'}},
      {data: {source: '2', target: '3', faveColor: '#6FB1FC'}},
      {data: {source: '3', target: '4', faveColor: '#6FB1FC'}},

      {data: {source: '4', target: '5', faveColor: '#EDA1ED'}},
      {data: {source: '5', target: '6', faveColor: '#EDA1ED'}},

      {data: {source: '6', target: '7', faveColor: '#86B342'}},
      {data: {source: '7', target: '8', faveColor: '#86B342'}}
     // {data: {source: '6', target: '2', faveColor: '#86B342'}}
    ]
  };
}