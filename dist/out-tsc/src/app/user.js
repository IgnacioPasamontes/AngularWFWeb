import { BehaviorSubject } from 'rxjs';
export class User {
    constructor() {
        this.name = 'Unknown';
        this.nameSource = new BehaviorSubject('Unknown');
        this.name$ = this.nameSource.asObservable();
        this.projectsSource = new BehaviorSubject({});
        this.projects$ = this.projectsSource.asObservable();
    }
    setName(name) {
        this.name = name;
        this.nameSource.next(this.name);
    }
    setProjects(projects) {
        this.projects = projects;
        this.projectsSource.next(this.projects);
    }
    getName() {
        return this.nameSource.getValue();
    }
    getProjects() {
        return this.projectsSource.getValue();
    }
}
//# sourceMappingURL=user.js.map