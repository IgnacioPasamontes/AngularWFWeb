import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { LoginService } from '../login/login.service';
let EachWorkflowService = class EachWorkflowService {
    constructor(http, loginService, globals) {
        this.http = http;
        this.loginService = loginService;
        this.globals = globals;
    }
    /**
     * Call to the server to create a new model with the given name
     * @param model Name of the model to add
     */
    getNodeInfo(project, node) {
        const url = environment.baseUrl + 'project/' + project + '/node/' + node;
        return this.http.get(url, { withCredentials: true });
    }
    getResources(node) {
        const url = environment.baseUrl + 'node/' + node + '/resources/';
        return this.http.get(url);
    }
    /*private handleError(error: any): Promise<any> {
      console.error('An error occurred', error); // for demo purposes only
      return Promise.reject(error.message || error);
    }*/
    getNodeInfoSync(project, node) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const url = environment.baseUrl + 'project/' + project + '/node/' + node;
            this.token = yield this.http.get(url, { withCredentials: true }).toPromise();
            return this.token;
        });
    }
    getProjectInfoSync(project) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const url = environment.baseUrl + 'project/' + project + '/status/';
            this.token = yield this.http.get(url, { withCredentials: true }).toPromise();
            return this.token;
        });
    }
    saveNode(project, node, output, comments, csrftoken) {
        const formData = new FormData();
        formData.append('output', output);
        formData.append('output_comments', comments);
        if (csrftoken !== null && csrftoken !== undefined) {
            formData.append(this.globals.csrftoken_form_input_name, csrftoken);
        }
        // formData.append('parameters',  this.model.parameters);
        const url = environment.baseUrl + 'project/' + project + '/node/' + node + '/';
        return this.http.post(url, formData, this.loginService.getPOSTHttpOptions());
    }
};
EachWorkflowService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    }),
    tslib_1.__metadata("design:paramtypes", [HttpClient,
        LoginService,
        Globals])
], EachWorkflowService);
export { EachWorkflowService };
//# sourceMappingURL=each-workflow.service.js.map