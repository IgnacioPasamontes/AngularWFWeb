import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { LoginService } from '../login/login.service';

export class ProblemFormulation {
  public scope: string = '';
  public decision_context: string = '';
  public endpoints: string = '';
  public uncertainty: string = '';
}


@Injectable({
  providedIn: 'root'
})
export class Node1ProblemFormulationService {

  constructor(private http: HttpClient, 
    private loginService : LoginService,
    public globals: Globals) { }



  getProblemDescription(project: number): Observable<any> {
    const url: string = environment.baseUrl + 'project/' + project + '/problem_description/';
    return this.http.get(url,{withCredentials: true});
  }




  saveNode(project: number, problem_formulation: ProblemFormulation, csrftoken?: string): Observable<any> {
    const node = 1;
    const formData = new FormData();
    Object.getOwnPropertyNames(problem_formulation).forEach(field => {
      formData.append(field, problem_formulation[field]);
    });
    
    if (csrftoken !== null && csrftoken !== undefined) {
      formData.append(this.globals.csrftoken_form_input_name,csrftoken);
    }
    // formData.append('parameters',  this.model.parameters);
    const url: string = environment.baseUrl  + 'project/' + project + '/problem_description/';
    return this.http.post(url, formData,this.loginService.getPOSTHttpOptions());

  }
  
}
