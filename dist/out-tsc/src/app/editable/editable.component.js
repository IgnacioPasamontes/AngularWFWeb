import * as tslib_1 from "tslib";
import { Component, ContentChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { ViewModeDirective } from './view-mode.directive';
import { EditModeDirective } from './edit-mode.directive';
import { fromEvent, Subject } from 'rxjs';
import { filter, take, switchMapTo } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
let EditableComponent = class EditableComponent {
    constructor(host) {
        this.host = host;
        this.update = new EventEmitter();
        this.editMode = new Subject();
        this.editMode$ = this.editMode.asObservable();
        this.mode = 'view';
    }
    ngOnInit() {
        this.viewModeHandler();
        this.editModeHandler();
    }
    toViewMode() {
        this.update.next();
        this.mode = 'view';
    }
    get element() {
        return this.host.nativeElement;
    }
    viewModeHandler() {
        fromEvent(this.element, 'dblclick').pipe(untilDestroyed(this)).subscribe(() => {
            this.mode = 'edit';
            this.editMode.next(true);
        });
    }
    editModeHandler() {
        const clickOutside$ = fromEvent(document, 'click').pipe(filter(({ target }) => this.element.contains(target) === false), take(1));
        this.editMode$.pipe(switchMapTo(clickOutside$), untilDestroyed(this)).subscribe(event => this.toViewMode());
    }
    get currentView() {
        return this.mode === 'view' ? this.viewModeTpl.tpl : this.editModeTpl.tpl;
    }
    ngOnDestroy() {
    }
};
tslib_1.__decorate([
    ContentChild(ViewModeDirective, { static: false }),
    tslib_1.__metadata("design:type", ViewModeDirective)
], EditableComponent.prototype, "viewModeTpl", void 0);
tslib_1.__decorate([
    ContentChild(EditModeDirective, { static: false }),
    tslib_1.__metadata("design:type", EditModeDirective)
], EditableComponent.prototype, "editModeTpl", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], EditableComponent.prototype, "update", void 0);
EditableComponent = tslib_1.__decorate([
    Component({
        selector: 'editable',
        template: `
    <ng-container *ngTemplateOutlet="currentView"></ng-container>
  `,
        styleUrls: ['./editable.component.css']
    }),
    tslib_1.__metadata("design:paramtypes", [ElementRef])
], EditableComponent);
export { EditableComponent };
//# sourceMappingURL=editable.component.js.map