import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../globals';
import { LoginService } from '../login/login.service';
let WelcomeComponent = class WelcomeComponent {
    constructor(globals, login, router) {
        this.globals = globals;
        this.login = login;
        this.router = router;
    }
    ngOnInit() {
        this.session_check_subscription = this.SessionCheck();
    }
    SessionCheck() {
        const username = undefined;
        const password = undefined;
        const resume = true;
        const csrftoken = undefined;
        return this.login.getUser(username, password, csrftoken, resume).subscribe(result => {
            if (result.id == null || !result.hasOwnProperty('id')) {
                this.router.navigate(['login']);
            }
            else {
                this.router.navigate(['main']);
            }
        }, error => {
            alert('Cannot connect to server.');
        });
    }
    ngOnDestroy() {
        this.session_check_subscription.unsubscribe();
    }
};
WelcomeComponent = tslib_1.__decorate([
    Component({
        selector: 'app-welcome',
        templateUrl: './welcome.component.html',
        styleUrls: ['./welcome.component.css']
    }),
    tslib_1.__metadata("design:paramtypes", [Globals,
        LoginService,
        Router])
], WelcomeComponent);
export { WelcomeComponent };
//# sourceMappingURL=welcome.component.js.map