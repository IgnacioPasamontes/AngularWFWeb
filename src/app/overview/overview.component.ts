import { Component, OnInit, Input, OnChanges} from '@angular/core';
import { OverviewService } from './overview.service';
import { Globals } from '../globals';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  public response: Array<Object> = [];
  public project_number: number;
  @Input() projectName;
  @Input() change;
  @Input() tabChange;

  constructor(private service: OverviewService,
    public globals: Globals) { }

  ngOnInit() {

  }

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('projectName')  || changes.hasOwnProperty('change')) {
      this.project_number = this.globals.current_user.projects[this.projectName];
      if (typeof this.project_number === 'undefined') { return; }
      const subs = this.service.getOverview(this.project_number).subscribe(
        result => {
          this.response = result;

        },
        error => {
  
            alert('Error getting overview data.');
            subs.unsubscribe();
        },
        () => {
          subs.unsubscribe();
        }
      );

    }

  }


  len(obj) {
    if (typeof obj === "undefined" || obj === null) {
      return 0;
    }
    return obj.length;
  }

}

