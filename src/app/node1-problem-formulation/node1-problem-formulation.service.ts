import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { LoginService } from '../login/login.service';

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


  saveNode(project: number, description: string, csrftoken?: string): Observable<any> {
    const node = 1;
    const formData = new FormData();
    formData.append('description', description);
    if (csrftoken !== null && csrftoken !== undefined) {
      formData.append(this.globals.csrftoken_form_input_name,csrftoken);
    }
    // formData.append('parameters',  this.model.parameters);
    const url: string = environment.baseUrl  + 'project/' + project + '/problem_description/';
    return this.http.post(url, formData,this.loginService.getPOSTHttpOptions());

  }
  
}
