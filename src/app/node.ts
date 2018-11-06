class ILink{
  label:string;
  data:string;
}
export class INode {
  top: number;
  left:number;
  properties:{
    id:string;
    title: string;
    info: string;
    parameters:string;
    //html code at this moment
    inputs: {  }
    //html code at this moment
    outputs:{  } 
  }
  executed:boolean;
}