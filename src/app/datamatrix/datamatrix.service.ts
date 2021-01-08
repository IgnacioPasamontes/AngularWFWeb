import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { User } from '../user';
import { LoginService } from '../login/login.service';
import { Compound, CompoundService } from '../compound/compound.service';

@Injectable({
  providedIn: 'root'
})
export class DatamatrixService {

  constructor(private http: HttpClient,
    private cookieService: CookieService,
    public globals: Globals,
    private loginService: LoginService) { }

  getMatrixData(project: number, ra_type: number): Observable<any> {
    const url: string = environment.baseUrl + 'project/' + project.toString() + '/compound/' +
    Compound.ra_type_abbrev_to_value_dict[ra_type] + '/datamatrix/';
    return this.http.get(url, {withCredentials: true});
  }
  getMatrixHeatmap(project: number, heatmap_name: string): Observable<any> {
    const url: string = environment.baseUrl + 'project/' + project.toString() + '/datamatrix/heatmap/json/'+heatmap_name+'/';
    return this.http.get(url, {withCredentials: true});
  }
}
