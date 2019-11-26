import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { LoginService } from '../login/login.service';
let NodeInfoService = class NodeInfoService {
    constructor(http, loginService, globals) {
        this.http = http;
        this.loginService = loginService;
        this.globals = globals;
    }
    saveNode(project, node, output, comments, csrftoken) {
        const formData = new FormData();
        formData.append('outputs', output);
        formData.append('outputs_comments', comments);
        if (csrftoken !== null && csrftoken !== undefined) {
            formData.append(this.globals.csrftoken_form_input_name, csrftoken);
        }
        // formData.append('parameters',  this.model.parameters);
        const url = environment.baseUrl + 'project/' + project + '/node/' + node + '/';
        return this.http.post(url, formData, this.loginService.getPOSTHttpOptions());
    }
};
NodeInfoService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    }),
    tslib_1.__metadata("design:paramtypes", [HttpClient,
        LoginService,
        Globals])
], NodeInfoService);
export { NodeInfoService };
//# sourceMappingURL=node-info.service.js.map