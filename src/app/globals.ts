import { Injectable } from '@angular/core';
import { User } from './user'
@Injectable()
export class Globals {
  projects: Array<string> = ["Project1","Project2","Project3"];
  users:{ [id: string] : User } = {
    "Nacho":{
    name: "Nacho",
    password: "nacho",
    projects: ["ProjectNacho1","ProjectNacho2","ProjectNacho3"]
    },
    "Pepe":{
      name: "Pepe",
      password: "pepe",
      projects: ["ProjectPepe1","ProjectPepe2","ProjectPepe3"]
    }
  }
  actual_user:User;
  active_projects : Array<string>=[]
}