import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  getUser(user: string): Observable<any> {
    const url: string = environment.baseUrl + 'user/' + user;
    return this.http.get(url);
  }
  getProjects(userID: number): Observable<any> {
    const url: string = environment.baseUrl + 'user/' + userID + '/projects';
    return this.http.get(url);
  }

}
