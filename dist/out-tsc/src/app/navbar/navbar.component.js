import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../globals';
import { LoginService } from '../login/login.service';
let NavbarComponent = class NavbarComponent {
    constructor(globals, loginService, router) {
        this.globals = globals;
        this.loginService = loginService;
        this.router = router;
    }
    ngOnInit() {
    }
    logout() {
        this.loginService.getLogoutCSRFToken().subscribe(csrf => {
            let csrftoken = null;
            if (csrf.hasOwnProperty('CSRF_TOKEN')) {
                csrftoken = csrf.CSRF_TOKEN;
            }
            this.loginService.logout(csrftoken).subscribe(result => {
                alert("You have logged out successfully.");
                this.router.navigate(['/']);
            }, error => { alert("An error happened while logging out."); });
        }, error => { alert("An error happened while getting logout CSRF Token."); });
    }
};
NavbarComponent = tslib_1.__decorate([
    Component({
        selector: 'app-navbar',
        templateUrl: './navbar.component.html',
        styleUrls: ['./navbar.component.css']
    }),
    tslib_1.__metadata("design:paramtypes", [Globals,
        LoginService,
        Router])
], NavbarComponent);
export { NavbarComponent };
//# sourceMappingURL=navbar.component.js.map