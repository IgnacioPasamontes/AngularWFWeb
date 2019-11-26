import * as tslib_1 from "tslib";
import { Directive, TemplateRef } from '@angular/core';
let ViewModeDirective = class ViewModeDirective {
    constructor(tpl) {
        this.tpl = tpl;
    }
};
ViewModeDirective = tslib_1.__decorate([
    Directive({
        selector: '[viewMode]'
    }),
    tslib_1.__metadata("design:paramtypes", [TemplateRef])
], ViewModeDirective);
export { ViewModeDirective };
//# sourceMappingURL=view-mode.directive.js.map