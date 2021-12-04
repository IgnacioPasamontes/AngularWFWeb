import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class OverviewService {

  constructor(private http: HttpClient, 
    private loginService : LoginService,
    public globals: Globals) { }

  getOverview(project: number): Observable<any> {
    const url: string = environment.baseUrl + 'project/' + project + '/overview/';
    return this.http.get(url,{withCredentials: true});
  }
}
