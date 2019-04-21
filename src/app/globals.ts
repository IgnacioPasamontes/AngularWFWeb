import { Injectable } from '@angular/core';
import { User } from './user';
import { INode } from './node';
@Injectable()
export class Globals {
  projects;
  actual_user: User;
  active_projects: Array<string> = [];
  visible_project = '';
  operatorId = '';
  actual_node: INode;
  change = false; // Tricki no realize WF change
}
