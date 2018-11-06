import { INode } from '../node';
import { Injectable } from '@angular/core';



const Molecule: INode = { 
    top: 20,
    left: 20,
    properties: {
        id:'',
        title: 'Molecules',
        info: 'Molecules INFO',
        parameters:'Molecules PARAMETERS',
        inputs: {},
        outputs: {
            output_1: {
                label: 'OUT',
                data:''
            }
        }        
    },
    executed:false
}

const Descriptors: INode = { 
    top: 20,
    left: 20,
    properties: {
        id:'',
        title: 'Molecules',
        info: 'Molecules INFO',
        parameters:'Molecules PARAMETERS',
        inputs: {
            input_1: {
                label: 'IN',
                data:''
            }
        },
        outputs: {
            output_1: {
                label: 'OUT',
                data:''
            }
        }        
    },
    executed:false
}
const Prediction: INode = { 
    top: 20,
    left: 20,
    properties: {
        id:'',
        title: 'Predict',
        info: 'Predcit INFO',
        parameters:'Predict PARAMETERS',
        inputs: {
            input_1: {
                label: 'IN',
                data:''
            }
        },
        outputs: {
            output_1: {
                label: 'OUT',
                data:''
            }
        }        
    },
    executed:false
}

export const Nodes:Array<INode>=[
    Molecule,
    Descriptors,
    Prediction
]
