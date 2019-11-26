import * as tslib_1 from "tslib";
import { Component, Input, Output } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Node1ProblemFormulationService } from './node1-problem-formulation.service';
import { Globals } from '../globals';
let Node1ProblemFormulationComponent = class Node1ProblemFormulationComponent {
    constructor(service, globals) {
        this.service = service;
        this.globals = globals;
        this.inline_problem_description = false;
        this.show_inline = false;
        this.Editor = ClassicEditor;
    }
    ngOnInit() {
        this.problem_description = this.info.inputs_comments;
    }
    NodeCompleted(project_id) {
        const node_id = 1;
        this.service.saveNode(this.info.project, this.problem_description, this.globals.node_csrf_token[project_id][node_id]).subscribe(result => {
            this.globals.change = !this.globals.change;
        });
        this.inline_problem_description = true;
        return false;
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], Node1ProblemFormulationComponent.prototype, "info", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", String)
], Node1ProblemFormulationComponent.prototype, "problem_description", void 0);
Node1ProblemFormulationComponent = tslib_1.__decorate([
    Component({
        selector: 'app-node1-problem-formulation',
        templateUrl: './node1-problem-formulation.component.html',
        styleUrls: ['./node1-problem-formulation.component.css']
    }),
    tslib_1.__metadata("design:paramtypes", [Node1ProblemFormulationService,
        Globals])
], Node1ProblemFormulationComponent);
export { Node1ProblemFormulationComponent };
//# sourceMappingURL=node1-problem-formulation.component.js.map