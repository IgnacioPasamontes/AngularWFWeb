import { Injectable } from '@angular/core';
import { User } from './user';
import { INode } from './node';
@Injectable()
export class Globals {
  current_user: User = new User();
  active_projects: Array<string> = [];
  visible_project = '';
  operatorId = '';
  actual_node: INode;
  change = false; // Tricki no realize WF change
  csrftoken_cookie_name = 'csrftoken';
  csrftoken_header_name = 'X-CSRFToken';
  csrftoken_form_input_name = 'csrfmiddlewaretoken';
  node_csrf_token: any = {};
}
