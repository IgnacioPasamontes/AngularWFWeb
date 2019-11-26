import * as tslib_1 from "tslib";
import { Directive, TemplateRef } from '@angular/core';
let EditModeDirective = class EditModeDirective {
    constructor(tpl) {
        this.tpl = tpl;
    }
};
EditModeDirective = tslib_1.__decorate([
    Directive({
        selector: '[editMode]'
    }),
    tslib_1.__metadata("design:paramtypes", [TemplateRef])
], EditModeDirective);
export { EditModeDirective };
//# sourceMappingURL=edit-mode.directive.js.map