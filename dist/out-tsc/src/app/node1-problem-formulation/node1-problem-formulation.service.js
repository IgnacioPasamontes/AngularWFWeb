import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { LoginService } from '../login/login.service';
let Node1ProblemFormulationService = class Node1ProblemFormulationService {
    constructor(http, loginService, globals) {
        this.http = http;
        this.loginService = loginService;
        this.globals = globals;
    }
    saveNode(project, inputs, csrftoken) {
        const node = 1;
        const formData = new FormData();
        formData.append('inputs_comments', inputs);
        if (csrftoken !== null && csrftoken !== undefined) {
            formData.append(this.globals.csrftoken_form_input_name, csrftoken);
        }
        // formData.append('parameters',  this.model.parameters);
        const url = environment.baseUrl + 'project/' + project + '/node/' + node + '/';
        return this.http.post(url, formData, this.loginService.getPOSTHttpOptions());
    }
};
Node1ProblemFormulationService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    }),
    tslib_1.__metadata("design:paramtypes", [HttpClient,
        LoginService,
        Globals])
], Node1ProblemFormulationService);
export { Node1ProblemFormulationService };
//# sourceMappingURL=node1-problem-formulation.service.js.map