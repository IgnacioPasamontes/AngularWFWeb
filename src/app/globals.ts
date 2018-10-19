import { Injectable } from '@angular/core';
import { User } from './user'
@Injectable()
export class Globals {
  projects: Array<string> = ["Project1","Project2","Project3"];
  users:{ [id: string] : User } = {
    "ignacio.pasamontes@gmail.com":{
    name: "Nacho",
    password: "nacho",
    projects: ["ProjectNacho1","ProjectNacho2","ProjectNacho3"]
    },
    "pepe@gmail.com":{
      name: "Pepe",
      password: "pepe",
      projects: ["ProjectPepe1","ProjectPepe2","ProjectPepe3"]
    }
  }
  actual_user:User;
  active_projects : Array<string>=[]
}