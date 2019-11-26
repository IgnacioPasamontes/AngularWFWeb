import { async, TestBed } from '@angular/core/testing';
import { EachWorkflowComponent } from './each-workflow.component';
describe('EachWorkflowComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EachWorkflowComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(EachWorkflowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=each-workflow.component.spec.js.map