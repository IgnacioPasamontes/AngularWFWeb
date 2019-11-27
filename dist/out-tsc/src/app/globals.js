import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { User } from './user';
let Globals = class Globals {
    constructor() {
        this.current_user = new User();
        this.active_projects = [];
        this.visible_project = '';
        this.operatorId = '';
        this.change = false; // Tricki no realize WF change
        this.csrftoken_cookie_name = 'csrftoken';
        this.csrftoken_header_name = 'X-CSRFToken';
        this.csrftoken_form_input_name = 'csrfmiddlewaretoken';
        this.node_csrf_token = {};
    }
};
Globals = tslib_1.__decorate([
    Injectable()
], Globals);
export { Globals };
//# sourceMappingURL=globals.js.map