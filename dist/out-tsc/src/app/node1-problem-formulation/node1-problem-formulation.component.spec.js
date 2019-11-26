import { async, TestBed } from '@angular/core/testing';
import { Node1ProblemFormulationComponent } from './node1-problem-formulation.component';
describe('Node1ProblemFormulationComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [Node1ProblemFormulationComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(Node1ProblemFormulationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=node1-problem-formulation.component.spec.js.map