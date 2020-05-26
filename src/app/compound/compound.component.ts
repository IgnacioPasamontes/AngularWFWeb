import { Component, OnInit, Input } from '@angular/core';
import { Compound, CompoundService } from './compound.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { TcCompoundsService } from '../tc-characterization/tc-compounds.service';

@Component({
  selector: 'app-compound',
  templateUrl: './compound.component.html',
  styleUrls: ['./compound.component.css']
})
export class CompoundComponent implements OnInit {

  constructor(private service: CompoundService,
              public tc_compounds: TcCompoundsService) { }

  static ra_abbr_to_ra_type_title: Object = {tc: 'Target', sc: 'Source'};
  static ra_abbr_to_ra_type: Object = {tc: Compound.TARGET_COMPOUND, sc: Compound.SOURCE_COMPOUND};

  @Input('info') info;
  @Input('ra_type') ra_type;


  ra_type_title: string;
  compounds$: Observable<Compound[]>;
  ra_compound_service: any;
  running: boolean = false;

  ngOnInit() {
    this.ra_type_title = CompoundComponent.ra_abbr_to_ra_type_title[this.ra_type];
    switch (this.ra_type) {
      case 'tc': {
        this.ra_compound_service = this.tc_compounds;
        break;
      }

      case 'sc': {
        this.ra_compound_service = null;
        this.compounds$ = null;
        break;
      }
      default : {
        alert('Invalid CompoundComponent RA type.');
        break;
      }
    }
    this.tc_compounds.getCompounds(this.info.project);

  }

  deleteCompound(int_id: number) {
    this.running = true;
    const subs = this.service.deleteCompound(this.info.project,
       CompoundComponent.ra_abbr_to_ra_type[this.ra_type], int_id).subscribe(
         result => {
          this.tc_compounds.getCompounds(this.info.project);
         },
         error => {
          alert('Cannot delete compound #' + int_id.toString());
          this.running = false;
         },
         () => {
          subs.unsubscribe();
          this.running = false;
         }
       );
  }

  copySmiles(textarea_id: string) {
    setTimeout(function(textarea_id) {
      (<any>document.getElementById(textarea_id)).select();
      document.execCommand('copy');
    }.bind(this, textarea_id), 0);
  }

}
