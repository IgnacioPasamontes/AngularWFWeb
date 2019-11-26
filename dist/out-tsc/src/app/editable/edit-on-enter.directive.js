import * as tslib_1 from "tslib";
import { Directive, HostListener } from '@angular/core';
import { EditableComponent } from './editable.component';
let EditableOnEnterDirective = class EditableOnEnterDirective {
    constructor(editable) {
        this.editable = editable;
    }
    onEnter() {
        this.editable.toViewMode();
    }
};
tslib_1.__decorate([
    HostListener('keyup.enter'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], EditableOnEnterDirective.prototype, "onEnter", null);
EditableOnEnterDirective = tslib_1.__decorate([
    Directive({
        selector: '[editableOnEnter]'
    }),
    tslib_1.__metadata("design:paramtypes", [EditableComponent])
], EditableOnEnterDirective);
export { EditableOnEnterDirective };
//# sourceMappingURL=edit-on-enter.directive.js.map