import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { INode } from '../node';
import { Globals } from '../globals';
import { LoginService } from '../login/login.service';


@Injectable({
  providedIn: 'root'
})
export class EachWorkflowService {

  constructor(private http: HttpClient,
              private loginService : LoginService,
              public globals: Globals) { }
  /**
   * Call to the server to create a new model with the given name
   * @param model Name of the model to add
   */
  getNodeInfo(project: number, node: number): Observable<any> {
    const url: string = environment.baseUrl + 'project/' + project + '/node/' + node;
    return this.http.get(url,{withCredentials: true});
  }
  getResources(node: number): Observable<any> {
    const url: string = environment.baseUrl + 'node/' + node + '/resources/';
    return this.http.get(url);
  }
  /*private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }*/

  async getNodeInfoSync(project: number, node: number) {
    const url: string = environment.baseUrl + 'project/' + project + '/node/' + node;
    let token = await this.http.get<INode>(url,{withCredentials: true}).toPromise();
    return token;
  }

  async getProjectInfoSync(project: number) {
    const url: string = environment.baseUrl + 'project/' + project + '/status/';
    let token = await this.http.get<any>(url,{withCredentials: true}).toPromise();
    return token;
  }

  getProjectInfo(project: number) {
    const url: string = environment.baseUrl + 'project/' + project + '/status/';
    return this.http.get(url,{withCredentials: true});
  }

  getAssetFileAsText(path: string) {
    const url: string = '/assets/' + path;
    return this.http.get(url,{responseType: "text", withCredentials: true});
  }

}
