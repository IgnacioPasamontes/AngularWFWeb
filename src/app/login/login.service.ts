import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  /**
   * Call to the server to create a new model with the given name
   * @param model Name of the model to add
   */
  getProjects(userID: number): Observable<any> {
    const url: string = environment.baseUrl + 'user/' + userID;
    return this.http.get(url);
  }

  deleteModel(model: string): Observable<any>  {
    const url: string = environment.baseUrl + 'models/' + model;
    return this.http.delete(url);
  }

  deleteVersion(model: string, version: string) {
    const url: string = environment.baseUrl + 'models/' + model + '/version/' + version;
    return this.http.delete(url);
  }

  cloneModel(model: string) {
    const url: string = environment.baseUrl + 'models/' + model;
    return this.http.put(url,null);
  }

  /**
   * @param modelname The model name to recieve parameters
   * Version will be automatically set to 'dev'
   */
  getParameters(model: string, version: string): Observable<any> {
    const url: string = environment.baseUrl + 'models/' + model + '/version/' + version + '/parameters';
    return this.http.get(url);
  }
}
