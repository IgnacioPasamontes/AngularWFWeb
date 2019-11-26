import * as tslib_1 from "tslib";
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../globals';
import { LoginService } from './login.service';
let LoginComponent = class LoginComponent {
    constructor(router, globals, service) {
        this.router = router;
        this.globals = globals;
        this.service = service;
        this.rememberme = false;
        this.success = false;
        this.error = false;
    }
    ngOnInit() {
    }
    getUserInfo(csrftoken) {
        const resume = false;
        this.getuser_subscription = this.service.getUser(this.user, this.user_password, csrftoken, resume, this.rememberme).subscribe(result => {
            this.service.setActualUserGlobals(result);
            this.router.navigate(['main']);
        }, error => {
            if (error.status === 401) {
                alert('Invalid username or password.');
            }
            else {
                alert('Cannot login.');
            }
        }, () => {
            this.user_password = '';
        });
    }
    login() {
        this.error = false;
        this.success = false;
        this.service.getUserCSRFToken().subscribe(csrf => {
            let csrftoken = null;
            if (csrf.hasOwnProperty('CSRF_TOKEN')) {
                csrftoken = csrf.CSRF_TOKEN;
            }
            this.getUserInfo(csrftoken);
        }, error => {
            alert("Cannot retrieve CSRF token.");
            return;
        });
    }
    ngOnDestroy() {
        this.getuser_subscription.unsubscribe();
    }
};
tslib_1.__decorate([
    ViewChild("tmpdiv", { static: true }),
    tslib_1.__metadata("design:type", ElementRef)
], LoginComponent.prototype, "tmpdiv", void 0);
LoginComponent = tslib_1.__decorate([
    Component({
        selector: 'app-login',
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.css']
    }),
    tslib_1.__metadata("design:paramtypes", [Router, Globals,
        LoginService])
], LoginComponent);
export { LoginComponent };
//# sourceMappingURL=login.component.js.map