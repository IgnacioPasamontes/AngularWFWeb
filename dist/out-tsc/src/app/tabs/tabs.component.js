import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Globals } from '../globals';
let TabsComponent = class TabsComponent {
    constructor(globals) {
        this.globals = globals;
        this.objectKeys = Object.keys;
    }
    ngOnInit() {
    }
    deleteProject(project) {
        const index = this.globals.active_projects.indexOf(project, 0);
        if (index > -1) {
            this.globals.active_projects.splice(index, 1);
        }
        this.globals.active_projects = [].concat(this.globals.active_projects);
        this.globals.visible_project = this.globals.active_projects[0];
    }
    openProject(project) {
        if (this.globals.active_projects.indexOf(project, 0) === -1) {
            this.globals.active_projects.push(project);
            this.globals.visible_project = project;
        }
    }
    visibleProject(project) {
        this.globals.visible_project = project;
    }
};
TabsComponent = tslib_1.__decorate([
    Component({
        selector: 'app-tabs',
        templateUrl: './tabs.component.html',
        styleUrls: ['./tabs.component.css']
    }),
    tslib_1.__metadata("design:paramtypes", [Globals])
], TabsComponent);
export { TabsComponent };
//# sourceMappingURL=tabs.component.js.map