import { Injectable, Inject, ReflectiveInjector, ComponentFactoryResolver } from '@angular/core';
import { HttpClient}  from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { LoginService } from '../login/login.service';
import { CKEditorComponent } from '../ckeditor/ckeditor.component';

@Injectable({
  providedIn: 'root'
})
export class NodeInfoService {

  private project_node_busy_count: Object = {};

  constructor(private http: HttpClient, 
              private loginService : LoginService,
              public globals: Globals) { }

  saveNode(project: number, node: number, output: string, comments: string,
    csrftoken?: string): Observable<any> {
    
    const formData = new FormData();
    formData.append('outputs', output);
    formData.append('outputs_comments', comments);
    if (csrftoken !== null && csrftoken !== undefined) {
      formData.append(this.globals.csrftoken_form_input_name,csrftoken);
    }
    // formData.append('parameters',  this.model.parameters);
    const url: string = environment.baseUrl  + 'project/' + project + '/node/' + node + '/';
    return this.http.post(url, formData,this.loginService.getPOSTHttpOptions());

  }

  setNodeAsBusy(project_id: number, node_seq: number, busy: boolean = true) {
    if (!this.project_node_busy_count.hasOwnProperty(project_id)) {
      this.project_node_busy_count[project_id] = {};

    }
    if (!this.project_node_busy_count[project_id].hasOwnProperty(node_seq)) {
      this.project_node_busy_count[project_id][node_seq] = 0;
    }
    if (busy) {
      this.project_node_busy_count[project_id][node_seq]++;
    } else {
      this.project_node_busy_count[project_id][node_seq]--;
    }
    
  }

  freeBusyProject(project_id: number) {
    if (this.project_node_busy_count.hasOwnProperty(project_id)) {
      delete this.project_node_busy_count[project_id];
    }   
  }

  getNodeBusy(project_id: number, node_seq: number) {
    if (!this.project_node_busy_count.hasOwnProperty(project_id)
        || !this.project_node_busy_count[project_id].hasOwnProperty(node_seq)) {
      return false;
    } else {
      return this.project_node_busy_count[project_id][node_seq] > 0;
    }

  }
}
