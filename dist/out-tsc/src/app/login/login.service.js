import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { User } from '../user';
let LoginService = class LoginService {
    constructor(http, cookieService, globals) {
        this.http = http;
        this.cookieService = cookieService;
        this.globals = globals;
    }
    /**
    *  Get CSRFToken for login
    *  https://docs.djangoproject.com/en/2.2/ref/csrf/
    */
    getUserCSRFToken() {
        const httpOptions = {
            withCredentials: true
        };
        const url = environment.baseUrl + 'user/';
        return this.http.get(url, httpOptions);
    }
    /**
    *  Get CSRFToken for logout
    *  https://docs.djangoproject.com/en/2.2/ref/csrf/
    */
    getLogoutCSRFToken() {
        const httpOptions = {
            withCredentials: true
        };
        const url = environment.baseUrl + 'user/logout/';
        return this.http.get(url, httpOptions);
    }
    /**
     * Call to the server to create a new model with the given name
     * @param model Name of the model to add
     */
    getUser(username, password, csrftoken, resume = false, rememberme = false) {
        const url = environment.baseUrl + 'user/';
        const formData = new FormData();
        if (!(resume || username == undefined || username == null || password == undefined || password == null)) {
            formData.append('username', username);
            formData.append('password', password);
        }
        if (csrftoken !== null && csrftoken !== undefined) {
            formData.append(this.globals.csrftoken_form_input_name, csrftoken);
        }
        if (rememberme) {
            formData.append('rememberme', '1');
        }
        if (resume && !rememberme) {
            return this.http.get(url, { withCredentials: true });
        }
        else {
            return this.http.post(url, formData, this.getPOSTHttpOptions());
        }
    }
    logout(csrftoken) {
        const url = environment.baseUrl + 'user/logout/';
        const formData = new FormData();
        if (csrftoken !== null && csrftoken !== undefined) {
            formData.append(this.globals.csrftoken_form_input_name, csrftoken);
        }
        return this.http.post(url, formData, this.getPOSTHttpOptions());
    }
    getProjects() {
        const url = environment.baseUrl + 'user/projects/';
        return this.http.get(url, { withCredentials: true });
    }
    getPOSTHttpOptions() {
        let HttpHeadersobj = {};
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
    getCSRFToken() {
        if (this.cookieService.check(this.globals.csrftoken_cookie_name)) {
            return this.cookieService.get(this.globals.csrftoken_cookie_name);
        }
        ;
        return null;
    }
    setActualUserGlobals(result) {
        this.globals.actual_user = new User();
        this.globals.actual_user.id = result.id;
        this.globals.actual_user.setName(result.first_name + ' ' + result.last_name);
        this.globals.actual_user.mail = result.email;
        this.globals.actual_user.setProjects({});
    }
};
LoginService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    }),
    tslib_1.__metadata("design:paramtypes", [HttpClient,
        CookieService,
        Globals])
], LoginService);
export { LoginService };
//# sourceMappingURL=login.service.js.map