import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { LoginService } from '../login/login.service';

export class InitialRAxHypothesis {
  analogue_category: string = '';
  metabolism: string = '';
  quantitative: string = '';
}

@Injectable({
  providedIn: 'root'
})
export class Node4InitialRaxHypothesisService {

  public InitialRAxHypothesisClass2dbFields: Object = {
    analogue_category: 'ana_cat_approach',
    metabolism: 'metabolism',
    quantitative: 'quantitative_var_approach'
  }

  public db2InitialRAxHypothesisClassFields: Object = {};

  constructor(private http: HttpClient, 
    private loginService : LoginService,
    public globals: Globals) { 
      Object.keys(this.InitialRAxHypothesisClass2dbFields).forEach( key => {
        this.db2InitialRAxHypothesisClassFields[this.InitialRAxHypothesisClass2dbFields[key]] = key; 
      })
    }

  getInitialRAxHypothesis(project: number): Observable<any> {
    const url: string = environment.baseUrl + 'project/' + project + '/initial_rax_hypothesis/';
    return this.http.get(url,{withCredentials: true});
  }


  saveNode(project: number, initial_rax_hypothesis_data: InitialRAxHypothesis, csrftoken?: string): Observable<any> {
    const node = 1;
    const formData = new FormData();
    Object.getOwnPropertyNames(initial_rax_hypothesis_data).forEach(field => {
      formData.append(this.InitialRAxHypothesisClass2dbFields[field], initial_rax_hypothesis_data[field]);
    });
    if (csrftoken !== null && csrftoken !== undefined) {
      formData.append(this.globals.csrftoken_form_input_name,csrftoken);
    }
    // formData.append('parameters',  this.model.parameters);
    const url: string = environment.baseUrl  + 'project/' + project + '/initial_rax_hypothesis/';
    return this.http.post(url, formData,this.loginService.getPOSTHttpOptions());

  }
}
