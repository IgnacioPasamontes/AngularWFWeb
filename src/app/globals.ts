import { Injectable } from '@angular/core';
import { User } from './user';
import { INode } from './node';
@Injectable()
export class Globals {
  current_user: User = new User();
  active_projects: Array<string> = [];
  previous_visible_project = '';
  visible_project = '';
  current_main_project = '';
  operatorId = '';
  actual_node: INode;
  change = false; // Tricki no realize WF change
  csrftoken_cookie_name = 'csrftoken';
  csrftoken_header_name = 'X-CSRFToken';
  csrftoken_form_input_name = 'csrfmiddlewaretoken';
  node_csrf_token: any = {};
  subproject_suffix_separator = ':'
  tk_project_suffix = this.subproject_suffix_separator+' TK'; 
  td_project_suffix = this.subproject_suffix_separator+' TD';
  tk_class_suffix = '_TK';
  td_class_suffix = '_TD';
}
