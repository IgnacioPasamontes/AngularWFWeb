import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Globals } from '../globals';
let SidebarComponent = class SidebarComponent {
    constructor(globals) {
        this.globals = globals;
        this.projectsName = 'New_Project';
        this.objectKeys = Object.keys;
    }
    ngOnInit() {
    }
    newProject() {
        let project = this.projectsName;
        let inserted = false;
        let num = 1;
        while (!inserted) {
            if (this.globals.active_projects.indexOf(project, 0) === -1 &&
                this.objectKeys(this.globals.actual_user.projects).indexOf(project, 0) === -1) {
                this.globals.active_projects.push(project);
                this.globals.visible_project = project;
                inserted = true;
            }
            else {
                project = this.projectsName + '_' + num;
                num++;
            }
        }
    }
};
SidebarComponent = tslib_1.__decorate([
    Component({
        selector: 'app-sidebar',
        templateUrl: './sidebar.component.html',
        styleUrls: ['./sidebar.component.css']
    }),
    tslib_1.__metadata("design:paramtypes", [Globals])
], SidebarComponent);
export { SidebarComponent };
//# sourceMappingURL=sidebar.component.js.map