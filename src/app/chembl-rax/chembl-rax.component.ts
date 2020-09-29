import { Component, OnInit, Input, AfterViewInit, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ChemblService } from '../chembl/chembl.service';
import { Compound, CompoundService } from '../compound/compound.service';
import { TcCompoundsService } from '../tc-characterization/tc-compounds.service';
import { ChemblRaxService, ChEMBLCompound } from './chembl-rax.service';
import { AsyncSubject, Observable } from 'rxjs';
import { data as example_data } from './example.js';
@Component({
  selector: 'app-chembl-rax',
  templateUrl: './chembl-rax.component.html',
  styleUrls: ['./chembl-rax.component.css']
})
export class ChemblRaxComponent implements OnInit {
  static ra_abbr_to_ra_type: Object = {tc: Compound.TARGET_COMPOUND, sc: Compound.SOURCE_COMPOUND};

  @Input() info;
  public ra_compound_service: any;
  public chembl_running: boolean = false;
  public input_type_radio_value: string = 'smiles';
  public chembl_search_string: string;
  public selected_compound_int_id: number;
  public rax_compounds_found: number = null;
  public tc_compound: Compound;

  public chembl_activity_fields: Array<string> = this.chembl.chembl_activity_fields;
  public chembl_displayed_activity_fields = this.chembl.chembl_displayed_activity_fields;
  public substructure_compound: Compound;
  public chembl_substructure_search_smiles: string = 'O=C(O)c1ccccc1';
  public chembl_substructure_search_page_size: number = 1000;
  public chembl_substructure_search_count: number = 0;
  public chembl_substructure_search_offset: number;
  public chembl_substructure_search_total_count: number;
  public chembl_substructure_search_result_compounds: Array<ChEMBLCompound> = [];
  public rdkit_similarity_cutoff: number;
  public rdkit_similarity_running: Boolean = false;
  public last_rdkit_similarity_cutoff: number;
  public chembl_substructure_search_filtered_compounds: Array<ChEMBLCompound> = [];
  public save_running: boolean = false;
  public saved_compounds: Compound[] = [];
  public chembl_activity_rows_compound: Object = {};


  constructor(private modalService: NgbModal,
    public tc_compounds: TcCompoundsService,
    public  compound: CompoundService,
    public chembl: ChemblService,
    public service: ChemblRaxService) { }

  ngOnInit() {
    this.ra_compound_service = this.tc_compounds;
    this.ra_compound_service.getCompounds(this.info.project);
    this.chembl_substructure_search_result_compounds = example_data;
  }

  raxFromSmilesButton(reset_activity_compound: boolean = true) {
    this.chembl_running = true;
    this.chembl_substructure_search_total_count = null;
    this.chembl_substructure_search_result_compounds = [];
    const subscript = this.service.chemblSmilesStandarize(this.chembl_search_string).subscribe(
      result => {
        const std_smiles = result.smiles;
        console.log('std_smiles: ' + std_smiles);
        this.chembl_substructure_search_smiles = std_smiles;
        let chembl_compounds: ChEMBLCompound[] = [];
        const subscript2 = this.chEMBLGetSubstrutureSearchMolecules(std_smiles, undefined, undefined,
        this.chembl_substructure_search_page_size).subscribe(
          data => {
            data['molecules'].forEach(molecule => {

              let chembl_id: string = molecule.molecule_chembl_id;
              let compound_obj: Object = {};
              compound_obj['smiles'] = molecule.molecule_structures.canonical_smiles;
              if (typeof molecule.pref_name === 'undefined') {
                compound_obj['name'] = chembl_id;
              } else {
                compound_obj['name'] = molecule.pref_name;
              }
              compound_obj['cas_rn'] = null;
              compound_obj['project'] = this.info.project;
              compound_obj['ra_type'] = Compound.SOURCE_COMPOUND;
              compound_obj['chembl_id'] = chembl_id;

              let compound = new Compound(compound_obj);
              let chembl_compound = new ChEMBLCompound(compound, chembl_id);
              chembl_compounds.push(chembl_compound);
            });
            console.log(chembl_compounds);
            this.chembl_substructure_search_result_compounds = chembl_compounds;
            console.log(this.chembl_substructure_search_result_compounds);
            const blob = new Blob([JSON.stringify(this.chembl_substructure_search_result_compounds)], {type: "octet/stream"});
            const url = window.URL.createObjectURL(blob);
            let hiddenElement = document.createElement('a');
            hiddenElement.href = url;
            hiddenElement.target = '_blank';
            hiddenElement.download = 'myFile.txt';
            hiddenElement.click();
            window.URL.revokeObjectURL(url);
            this.chembl_running = false;
          },
          error => {
            alert('Error retrieving ChEMBL substructures.');
            console.log('Error retrieving ChEMBL substructures:');
            console.log(error);
            this.chembl_substructure_search_result_compounds = chembl_compounds;
            console.log(this.chembl_substructure_search_result_compounds);
            const blob = new Blob([JSON.stringify(this.chembl_substructure_search_result_compounds)], {type: "octet/stream"});
            const url = window.URL.createObjectURL(blob);
            let hiddenElement = document.createElement('a');
            hiddenElement.href = url;
            hiddenElement.target = '_blank';
            hiddenElement.download = 'myFile.txt';
            hiddenElement.click();
            window.URL.revokeObjectURL(url);
            this.chembl_running = false;
          },
          () => {
            subscript2.unsubscribe();
          }
        );
      },
      error => {
        alert('Error standardizing or converting SMILES to InChiKey');
        this.chembl_running = false;
      },
      () => {
        subscript.unsubscribe();
      }
    );
    this.service.chEMBLSearchSubstructure(this.chembl_search_string);
  }

  raxFromCompoundButton() {
    this.chembl_running = true;
    const old_chembl_search_string: string = this.chembl_search_string;
    const tc_compound: Compound = this.substructure_compound;

    if (typeof tc_compound !== 'undefined') {
      this.chembl_search_string = tc_compound.smiles;
      this.tc_compound = tc_compound;
      this.raxFromSmilesButton(false);
      this.chembl_search_string = old_chembl_search_string;
    } else {
      alert('Compound #' + this.selected_compound_int_id.toString() + 'not found.');
      this.chembl_running = false;
    }
  }

  chemblSearchStringChange($event) {
    if (this.service.chEMBLSearchSubstructure(this.chembl_search_string, undefined, true)) {
      this.chembl_substructure_search_page_size = this.service.GET_DEFAULT_LIMIT;
    } else {
      this.chembl_substructure_search_page_size = this.service.POST_DEFAULT_LIMIT;
    }
  }

  compoundChange() {
    const BreakException = {};
    try {
      this.ra_compound_service.compounds$.getValue().forEach(compound => {
        if (compound.int_id === this.selected_compound_int_id) {
          this.substructure_compound = compound;
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) { throw e; }
    }

    if (this.service.chEMBLSearchSubstructure(this.substructure_compound.smiles, undefined, true)) {
      this.chembl_substructure_search_page_size = this.service.GET_DEFAULT_LIMIT;
    } else {
      this.chembl_substructure_search_page_size = this.service.POST_DEFAULT_LIMIT;
    }
  }

  parseChEMBLMoleculeData(chembl_result: Object, molecule_rows: Object[],
    chembl_molecule_rows$: AsyncSubject<Object>, count: number = 0,
    limit: number = 1000000, page_size: number = null) {
    let total_count: number;
    let offset: number;
    if (chembl_result.hasOwnProperty('page_meta')) {
      if (chembl_result['page_meta'].hasOwnProperty('offset')) {
        offset = chembl_result['page_meta']['offset'];
      }
      if (chembl_result['page_meta'].hasOwnProperty('total_count')) {
        total_count = chembl_result['page_meta']['total_count'];
      }

    }
    chembl_result['molecules'].forEach(molecule => {
      if (count > limit) {
        this.chembl_substructure_search_count = count;
        this.chembl_substructure_search_offset = offset;
        this.chembl_substructure_search_total_count = total_count;
        return [offset, total_count, count];
      }
      let molecule_row: Object = {
        molecule_chembl_id: molecule.molecule_chembl_id,
        pref_name: molecule.pref_name
      };
      molecule_row['molecule_structures'] = {
        'canonical_smiles': molecule.molecule_structures.canonical_smiles
      };

/*         let chembl_id: string = molecule.molecule_chembl_id;
      let compound_obj: Object = {};
      compound_obj['smiles'] = molecule.molecule_structures.canonical_smiles;
      if (typeof molecule.pref_name === 'undefined') {
        compound_obj['name'] = null;
      } else {
        compound_obj['name'] = molecule.pref_name;
      }
      compound_obj['cas_rn'] = null;
      compound_obj['project'] = this.info.project;
      compound_obj['ra_type'] = Compound.SOURCE_COMPOUND;

      let compound = new Compound(compound_obj);
      let chembl_compound =new ChEMBLCompound(compound, chembl_id); */
      molecule_rows.push(molecule_row);
      count++;
    });
    chembl_molecule_rows$.next({molecules: molecule_rows});

    if (chembl_result.hasOwnProperty('page_meta')) {
        if (chembl_result['page_meta'].hasOwnProperty('next')) {
          const next = chembl_result['page_meta'].next;
          if (typeof next !== 'undefined' && next !== null) {
            const subs = this.service.chEMBLGetMoleculeDataNext(next, page_size).subscribe(
              chembl_result2 => {
                this.parseChEMBLMoleculeData(chembl_result2, molecule_rows, chembl_molecule_rows$, count, limit, page_size);
                subs.unsubscribe();
              },
              error => {
                // chembl_molecule_rows$.error(error);
                chembl_molecule_rows$.complete();
                subs.unsubscribe();
              }
            );
          } else {
            chembl_molecule_rows$.complete();
          }
        } else {
          chembl_molecule_rows$.complete();
        }
    } else {
      chembl_molecule_rows$.complete();
    }
    this.chembl_substructure_search_count = count;
    this.chembl_substructure_search_offset = offset;
    this.chembl_substructure_search_total_count = total_count;
    return [offset, total_count, count];
  }

  chEMBLGetSubstrutureSearchMolecules(smiles: string, limit: number = 1000000, _count: number = 0, page_size: number  = null) {

    let chembl_molecule_rows$ = new AsyncSubject<Object>();
    let molecule_rows: Object[] = [];
    const subs = (<Observable<Object>>this.service.chEMBLSearchSubstructure(smiles, page_size)).subscribe(
      chembl_result => {
        this.parseChEMBLMoleculeData(chembl_result, molecule_rows, chembl_molecule_rows$, _count, limit);
        subs.unsubscribe();
      },
      error => {
        alert('Error retrieving data from ChEMBL. Try again or decrease page size.');
        console.log('Error retrieving data from ChEMBL:');
        console.log(error);
        chembl_molecule_rows$.error(error);
        subs.unsubscribe();
      }
    );
    return chembl_molecule_rows$;
  }

  parseChEMBLGetADMETActivityData(chembl_result: Object, activity_rows: Object[],
    chembl_activity_rows$: AsyncSubject<Object>, idx: number, count: number = 0,
    limit: number = 1000000, fields: Array<string> = null) {

    if (fields != null) {
      chembl_result['activities'].forEach(activity => {
        if (count > limit) {
          return;
        }
        let activity_row: Object = {};
        this.chembl_activity_fields.forEach(field => {
          activity_row[field] = activity[field];
        });
        activity_rows.push(activity_row);
        count++;
      });
    } else {
      if (count > limit) {
        return;
      }
      const activity_num: number = chembl_result['activities'].length;
      const activity_num_to_push: number = activity_num + count > limit ? limit - count : activity_num;
      [].push.apply(activity_rows,chembl_result['activities'].slice(0, activity_num_to_push));
      count += activity_num_to_push;
    }

    chembl_activity_rows$.next({activities: activity_rows, idx: idx});

    if (chembl_result.hasOwnProperty('page_meta')) {
      if (chembl_result['page_meta'].hasOwnProperty('next')) {
        const next = chembl_result['page_meta'].next;
        if (typeof next !== 'undefined' && next !== null) {
          const subs = this.chembl.chEMBLGetADMETActivityDataNext(next).subscribe(
            chembl_result2 => {
              this.parseChEMBLGetADMETActivityData(chembl_result2, activity_rows, chembl_activity_rows$, idx, count, limit, fields);
              subs.unsubscribe();
            },
            error => {
              alert('Error retrieving data from ChEMBL.');
              subs.unsubscribe();
              chembl_activity_rows$.error(error);
            }
          );
        } else {

          chembl_activity_rows$.complete();

        }
      } else {
        chembl_activity_rows$.complete();

      }
    } else {
      chembl_activity_rows$.complete();

    }
  }

  chEMBLGetADMETActivityDataByCompoundId(chembl_id: string, idx: number , fields: Array<string> = null, limit: number = 1000000, _count: number = 0) {

        let chembl_activity_rows$ = new AsyncSubject<Object>();
        let activity_rows: Object[] = [];
        const subs = this.chembl.chEMBLGetADMETActivityDataByCompoundId(chembl_id).subscribe(
          chembl_result => {
            this.parseChEMBLGetADMETActivityData(chembl_result, activity_rows, chembl_activity_rows$, idx, _count, limit, fields);
            subs.unsubscribe();
          },
          error => {
            alert('Error retrieving data from ChEMBL.');
            subs.unsubscribe();
            chembl_activity_rows$.error(error);
          }
        );
        return chembl_activity_rows$;
  }

  filterBySimilarityButton() {
    this.rdkit_similarity_running = true;
    if (typeof this.rdkit_similarity_cutoff === 'undefined' || this.rdkit_similarity_cutoff === null ||
      this.rdkit_similarity_cutoff === 0) {
        this.chembl_substructure_search_filtered_compounds = this.chembl_substructure_search_result_compounds;
        this.rdkit_similarity_running = false;
        this.rdkit_similarity_cutoff = 0;
        this.last_rdkit_similarity_cutoff = this.rdkit_similarity_cutoff;
        return;
    }
    this.chembl_substructure_search_filtered_compounds = [];
    let smiles_array: string[] = [];
    this.chembl_substructure_search_result_compounds.forEach(
      chembl_compound => {
        smiles_array.push(chembl_compound.compound.smiles);
      }
    );
    const subs = this.service.setFingerPrintSimilarityFromSmiles(this.chembl_substructure_search_smiles).subscribe(
      result => {
        const subs2 = this.service.similarityFromSmiles(smiles_array, this.rdkit_similarity_cutoff).subscribe(
          result2 => {
            let compounds: Array<ChEMBLCompound> = [];
            result2['molecules'].forEach(element => {
              compounds.push(this.chembl_substructure_search_result_compounds[element.index]);
            });
            this.chembl_substructure_search_filtered_compounds = compounds;
            this.last_rdkit_similarity_cutoff = this.rdkit_similarity_cutoff;
            console.log(compounds);
            this.rdkit_similarity_running = false;
            subs2.unsubscribe();
          },
          error => {
            alert('Error while filtering by similarity.');
            this.rdkit_similarity_running = false;
            subs2.unsubscribe();
          }
        );
        subs.unsubscribe();
      },
      error => {
        alert('Error setting RDKit fingerprint for similarity filtering.');
        this.rdkit_similarity_running = false;
        subs.unsubscribe();
      },

    );
  }

  saveButton() {
    this.save_running = true;
    const compounds: Compound[] = [];
    this.saved_compounds = [];
    this.chembl_substructure_search_filtered_compounds.forEach(chembl_compound => {
      compounds.push(chembl_compound.compound);
    });
    const subs = this.compound.saveCompounds(compounds, Compound.SOURCE_COMPOUND, this.info.project).subscribe(
      compounds_obj => {
        alert('Compounds saved successfully.');
        compounds_obj.forEach(compound_obj => {
          this.saved_compounds.push(new Compound(compound_obj));
        });
        this.getSavedCompoundsActivity();
        this.save_running = false;
        subs.unsubscribe();
      }, error => {
        alert('Error saving compounds.');
        
        this.save_running = false;
        subs.unsubscribe();
      },

    );
  }

  getSavedCompoundsActivity() {
    this.chembl_running = true;
    let success_count: number = 0;
    this.chembl_activity_rows_compound = {};
    let chembl_activity_downloaded$ = new AsyncSubject<string>();
  
    const subs = chembl_activity_downloaded$.subscribe(result => {

    });
    let idx: number = 0;
    this.saved_compounds.forEach(compound => {
      this.chembl_activity_rows_compound[idx] = {};
      this.chembl_activity_rows_compound[idx]['compound'] = compound;
      this.chembl_activity_rows_compound[idx]['chembl_activity_rows'] = [];
      const chembl_id = compound.chembl_id;
      const chembl_activity_rows$ = this.chEMBLGetADMETActivityDataByCompoundId(chembl_id, idx, this.chembl.chembl_activity_fields);
      const chembl_subs = chembl_activity_rows$.subscribe(
        chembl_result => {
          let chembl_activity_rows: Object[] = this.chembl_activity_rows_compound[chembl_result['idx']]['chembl_activity_rows'];
          chembl_activity_rows = chembl_activity_rows.concat(chembl_result['activities']);
          this.chembl_activity_rows_compound[chembl_result['idx']]['chembl_activity_rows'] = chembl_activity_rows;
          success_count++;

        },
        error => {
          chembl_subs.unsubscribe();
          chembl_activity_downloaded$.next('error');
        },
        () => {
          chembl_activity_downloaded$.next('completed');
          chembl_subs.unsubscribe();
        }
      );
      idx++;
    });
    this.chembl_running = false;

  }

  saveActivities() {
    console.log(this.chembl_activity_rows_compound);
    Object.keys(this.chembl_activity_rows_compound).sort((a, b) => Number(a) - Number(b)).forEach(idx => {
      const compound = this.chembl_activity_rows_compound[idx]['compound'];
      const chembl_activity_rows = this.chembl_activity_rows_compound[idx]['chembl_activity_rows'];
      if (chembl_activity_rows.length > 0) {
        const subs = this.chembl.saveChemblData(compound, chembl_activity_rows).subscribe(result => {
          this.chembl_running = false;
        },
        error => {
          console.log('Error while saving ChEMBL data. For molecule: ' + compound.chembl_id);
          this.chembl_running = false;
          subs.unsubscribe();
        },
        () => {
          subs.unsubscribe();
        });
      }
    });

  }

  typeof(variable) {
    return typeof variable;
  }
  object_keys(obj: Object) {
    return Object.keys(obj);
  }
}
