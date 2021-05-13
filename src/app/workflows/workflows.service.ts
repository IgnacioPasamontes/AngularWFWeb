import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { LoginService } from '../login/login.service';
import { AsyncSubject, BehaviorSubject } from 'rxjs';
import { Compound } from '../compound/compound.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowsService {

  constructor(private http: HttpClient,
    private loginService: LoginService) { }


saveCompoundImage(project: number ,compounds: Compound[], img_data_list: string[]): Observable<any> {
    const compound_objs: Object[] = [];
    compounds.forEach(compound => {
      let compound_obj = compound.getObject(false);

      if (typeof compound.getObject === 'function') {
        compound_obj = compound.getObject(false);
      } else if (typeof compound === 'object') {
        compound_obj = compound;
      } else {
        compound_obj = Compound.getObject(compound, false); 
      }
      compound_objs.push(compound_obj);
    });

    const data = JSON.stringify({'compounds': compound_objs, 'images':img_data_list});
    const options = this.loginService.getPOSTHttpOptions();
    options['headers'] = options['headers'].append('Content-Type', 'application/json');
    const url: string = environment.baseUrl  + 'project/' + project + '/compound/multiple/save/image/';

    return this.http.post(url, data, options);

  }
}