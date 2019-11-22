import { BehaviorSubject } from 'rxjs';

export class User {
  id: number;
  name: string = 'Unknown';
  mail: string;
  password: string;
  projects: {};
  private nameSource = new BehaviorSubject<string>('Unknown');
  name$ = this.nameSource.asObservable();
  private projectsSource = new BehaviorSubject<any>({});
  projects$ = this.projectsSource.asObservable();

  setName(name: string) {
    this.name = name;
    this.nameSource.next(this.name);
  }

  setProjects(projects: any) {
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
