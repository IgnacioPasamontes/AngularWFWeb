import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';
describe('LoginService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));
    it('should be created', () => {
        const service = TestBed.get(LoginService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=login.service.spec.js.map