import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,
              private cookieService: CookieService,
              public globals: Globals) { }

  /**
  *  Get CSRFToken for login
  *  https://docs.djangoproject.com/en/2.2/ref/csrf/
  */
  getUserCSRFToken(): Observable<any> {

    const httpOptions = {
      withCredentials: true
    };
    const url: string = environment.baseUrl + 'user/';
    return this.http.get(url, httpOptions);

  }

  /**
  *  Get CSRFToken for logout
  *  https://docs.djangoproject.com/en/2.2/ref/csrf/
  */
 getLogoutCSRFToken(): Observable<any> {

  const httpOptions = {
    withCredentials: true
  };
  const url: string = environment.baseUrl + 'user/logout/';
  return this.http.get(url, httpOptions);

}

  /**
   * Call to the server to create a new model with the given name
   * @param model Name of the model to add
   */
  getUser(username?: string, password?: string, csrftoken?: string, resume: boolean = false, rememberme: boolean = false): Observable<any> {
    const url: string = environment.baseUrl + 'user/';
    const formData = new FormData();
    if (!(resume || username == undefined || username == null || password == undefined || password == null)) {
      formData.append('username', username);
      formData.append('password', password);
    }


    if (csrftoken !== null && csrftoken !== undefined) {
      formData.append(this.globals.csrftoken_form_input_name,csrftoken);
    }

    if (rememberme) {
      formData.append('rememberme', '1');
    }

    if (resume && !rememberme) {
      return this.http.get(url,{withCredentials: true});
    } else {
      return this.http.post(url, formData,this.getPOSTHttpOptions());
    }
    
  }

  logout(csrftoken?: string) {
    const url: string = environment.baseUrl + 'user/logout/'
    const formData = new FormData();
    if (csrftoken !== null && csrftoken !== undefined) {
      formData.append(this.globals.csrftoken_form_input_name,csrftoken);
    }
    return this.http.post(url, formData,this.getPOSTHttpOptions());
  }
  getProjects(): Observable<any> {
    const url: string = environment.baseUrl + 'user/projects/';
    return this.http.get(url,{withCredentials: true});
  }

  getPOSTHttpOptions(): Object {
    const HttpHeadersobj: any = {};
    HttpHeadersobj[this.globals.csrftoken_header_name] = this.getCSRFToken();
    const httpOptions = {
      withCredentials: true,
      headers: new HttpHeaders(HttpHeadersobj)
    };
    return httpOptions;
  }


  /**
  *  Get CSRFToken from cookie
  *  https://docs.djangoproject.com/en/2.2/ref/csrf/
  */
  getCSRFToken(): string {
    if (this.cookieService.check(this.globals.csrftoken_cookie_name)) {
      return this.cookieService.get(this.globals.csrftoken_cookie_name);
    };
    return null;
  }

  setCurrentUserGlobals(result) {
    this.globals.current_user = new User();
    this.globals.current_user.id = result.id;
    this.globals.current_user.setName(result.first_name+' '+result.last_name);
    this.globals.current_user.mail = result.email;
    this.globals.current_user.setProjects({});
  }
  

}
