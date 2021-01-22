import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Name2casComponent } from '../name2cas/name2cas.component';
import { ChemblComponent } from '../chembl/chembl.component';
import { Compound, CompoundService } from '../compound/compound.service';
import { BehaviorSubject } from 'rxjs';
import { TcCompoundsService } from './tc-compounds.service';

@Component({
  selector: 'app-tc-characterization',
  templateUrl: './tc-characterization.component.html',
  styleUrls: ['./tc-characterization.component.css']
})
export class TcCharacterizationComponent implements OnInit {

  constructor(private compound_service: CompoundService,
              private tc_compound: TcCompoundsService)  {}

  @Input() info;
  @ViewChild('name2cas', {static: false}) name2cas: Name2casComponent;
  @ViewChild('chembl', {static: false}) chembl: ChemblComponent;

  public resources_compound = new Compound();


  ngOnInit() {
    this.resources_compound.project = this.info.project;
    this.resources_compound.ra_type = Compound.TARGET_COMPOUND;
  }

  saveCompound() {
    if (typeof this.name2cas.compound_name === 'undefined') {
      alert('Please select a name for the compound.');
      return;
    }
    if (typeof this.name2cas.cas.current_item === 'undefined') {
      alert('Please select a CAS registry number for the compound.');
      return;
    }
    if (typeof this.name2cas.smiles.current_item === 'undefined') {
      alert('Please select an struture for the compound.');
      return;
    }
    this.resources_compound.name = this.name2cas.compound_name;
    this.resources_compound.cas_rn = this.name2cas.cas.current_item['value'];
    this.resources_compound.smiles = this.name2cas.smiles.current_item['value'];
    const subs = this.compound_service.saveCompound(this.resources_compound).subscribe(result => {
      alert('Compound saved');
      this.tc_compound.getCompounds(this.info.project);
    },
    error => {
      alert('Error saving the compound.');
      subs.unsubscribe();
    },
    () => {
      subs.unsubscribe();
    });
  }
}
