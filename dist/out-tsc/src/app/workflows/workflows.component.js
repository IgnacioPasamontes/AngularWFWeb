import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Globals } from '../globals';
let WorkflowsComponent = class WorkflowsComponent {
    constructor(globals) {
        this.globals = globals;
    }
    ngOnInit() {
    }
};
WorkflowsComponent = tslib_1.__decorate([
    Component({
        selector: 'app-workflows',
        templateUrl: './workflows.component.html',
        styleUrls: ['./workflows.component.css']
    }),
    tslib_1.__metadata("design:paramtypes", [Globals])
], WorkflowsComponent);
export { WorkflowsComponent };
//# sourceMappingURL=workflows.component.js.map