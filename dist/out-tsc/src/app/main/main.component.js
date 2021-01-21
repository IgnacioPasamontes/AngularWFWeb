import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../globals';
import { LoginService } from '../login/login.service';
let MainComponent = class MainComponent {
    constructor(globals, login, router) {
        this.globals = globals;
        this.login = login;
        this.router = router;
    }
    ngOnInit() {
        if (this.globals.current_user == undefined || this.globals.current_user.id == null) {
            this.getUserInfo();
        }
        this.getUserProjects();
        document.getElementById('sidebarCollapse').addEventListener('click', function () {
            document.getElementById('sidebar').classList.toggle('active');
        });
        document.getElementById('[rel=\'tooltip\']');
    }
    change() {
        this.globals.change = !this.globals.change;
        this.globals.change_datamatrix = !this.globals.change_datamatrix;
    }
    getUserInfo(csrftoken) {
        let username; // = undefined
        let password; //= undefined
        const resume = true;
        this.getuser_subscription = this.login.getUser(username, password, csrftoken, resume).subscribe(result => {
            if (result.id == null || !result.hasOwnProperty('id')) {
                this.router.navigate(['login']);
                return;
            }
            this.login.setActualUserGlobals(result);
        }, error => {
            alert('Cannot connect to server.');
        });
    }
    getUserProjects() {
        this.getprojects_subscription = this.login.getProjects().subscribe(result2 => {
            let projects = {};
            for (const project of result2) {
                projects[project.name] = project.id;
            }
            this.globals.current_user.setProjects(projects);
        }, error => {
            alert('Error getting user projects.');
        });
    }
    ngOnDestroy() {
        this.getuser_subscription.unsubscribe();
        this.getprojects_subscription.unsubscribe();
    }
};
MainComponent = tslib_1.__decorate([
    Component({
        selector: 'app-main',
        templateUrl: './main.component.html',
        styleUrls: ['./main.component.css']
    }),
    tslib_1.__metadata("design:paramtypes", [Globals,
        LoginService,
        Router])
], MainComponent);
export { MainComponent };
//# sourceMappingURL=main.component.js.map