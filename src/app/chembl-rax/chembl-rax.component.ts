import { Component, OnInit, Input, AfterViewInit, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ChemblService } from '../chembl/chembl.service';
import { Compound, CompoundService } from '../compound/compound.service';
import { TcCompoundsService } from '../tc-characterization/tc-compounds.service';
import { ChemblRaxService, ChEMBLCompound } from './chembl-rax.service';
import { AsyncSubject, Observable } from 'rxjs';
import { data as example_data } from './example.js';
import { data as example_pc_data } from './example_pc.js';

declare let SmilesDrawer: any;

@Component({
  selector: 'app-chembl-rax',
  templateUrl: './chembl-rax.component.html',
  styleUrls: ['./chembl-rax.component.css']
})
export class ChemblRaxComponent implements OnInit {
  static ra_abbr_to_ra_type: Object = {tc: Compound.TARGET_COMPOUND, sc: Compound.SOURCE_COMPOUND};

  @Input() info;
  public ra_compound_service: any;
  public chembl_search_type_radio_value = 'similarity';
  public chembl_structural_search_running: boolean = false;
  public chembl_running: boolean = false;
  public input_type_radio_value: string = 'compound';
  public chembl_search_string: string;
  public chembl_similarity_cutoff: number = 80;
  public selected_compound_int_id: number = 0;
  public rax_compounds_found: number = null;
  public tc_compound: Compound;
  public chembl_calculated_pc_row_chemblid: Object = {};
  public chembl_activity_fields: Array<string> = this.chembl.chembl_activity_fields;
  public chembl_displayed_activity_fields = this.chembl.chembl_displayed_activity_fields;
  public substructure_compound: Compound;
  public chembl_search_smiles: string = 'O=C(O)c1ccccc1';
  public chembl_search_page_size: number = 1000;
  public chembl_search_count: number = 0;
  public chembl_search_offset: number;
  public chembl_search_total_count: number;
  public chembl_search_result_compounds: Array<ChEMBLCompound> = [];
  public rdkit_similarity_cutoff: number;
  public rdkit_similarity_running: Boolean = false;
  public last_rdkit_similarity_cutoff: number;
  public chembl_search_filtered_compounds: Array<ChEMBLCompound> = [];
  public save_running: boolean = false;
  public saved_compounds: Compound[] = [];
  public chembl_activity_rows_compound: Object = {};
  public chembl_activity_errors: string = '';
  public canvas_id: string = "tmp_sc_similarity_chembl_search";
  public parent_canvas_id: string = "sc_similarity_chembl_search_parent";
  public smiles_drawer_size: number = 200;
  public chembl_search_result_compounds_image_data: Array<any> = [];
  public chembl_search_filtered_compounds_image_data: Array<any> = [];


  constructor(private modalService: NgbModal,
    public tc_compounds: TcCompoundsService,
    public  compound: CompoundService,
    public chembl: ChemblService,
    public service: ChemblRaxService) { }

  ngOnInit() {
    this.ra_compound_service = this.tc_compounds;
    this.ra_compound_service.getCompounds(this.info.project);

    (<Object[]>example_data).forEach((value, index) => {
      example_data[index]["compound"]["project"] = this.info.project;
    })

    // this.chembl_search_result_compounds = example_data;
    // this.chembl_calculated_pc_row_chemblid = example_pc_data;
  }


  chemblSearchTypeChange($event) {
    switch (this.chembl_search_type_radio_value) {
      case 'similarity':
        this.input_type_radio_value = 'compound';
        break;
      case 'substructure':
        this.input_type_radio_value = 'smiles';
        break;
      default:
        throw Error('Invalid ChEMBL search type "'+this.chembl_search_type_radio_value+'".')
        break;
    } 
  }

  raxFromSmilesButton(reset_activity_compound: boolean = true, type: string = 'substructure') {
    this.chembl_structural_search_running = true;
    this.chembl_running = true;
    this.chembl_search_total_count = null;
    this.chembl_search_result_compounds = [];
    this.chembl_activity_errors = '';
    const subscript = this.service.chemblSmilesStandarize(this.chembl_search_string).subscribe(
      result => {
        const std_smiles = result.smiles;
        console.log('std_smiles: ' + std_smiles);
        this.chembl_search_smiles = std_smiles;
        let chembl_compounds: ChEMBLCompound[] = [];
        let chembl_search: AsyncSubject<Object>;
        switch (type) {
          case 'similarity':
            chembl_search = this.chEMBLGetSimilaritySearchMolecules(std_smiles,this.chembl_similarity_cutoff, undefined, undefined,
              this.chembl_search_page_size);
            break;
          case 'substructure':
            chembl_search = this.chEMBLGetSubstrutureSearchMolecules(std_smiles, undefined, undefined,
              this.chembl_search_page_size);
            break;
          default:
            throw Error('Invalid ChEMBL search type "'+type+'".')
            break;
        } 
        const subscript2 = chembl_search.subscribe(
          data => {
            data['molecules'].forEach(molecule => {

              let chembl_id: string = molecule.molecule_chembl_id;
              let compound_obj: Object = {};
              compound_obj['smiles'] = molecule.molecule_structures.canonical_smiles;
              if (typeof molecule.pref_name === 'undefined'|| molecule.pref_name===null || molecule.pref_name.trim()==='') {
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
            this.chembl_search_result_compounds = chembl_compounds;

/*             console.log(this.chembl_search_result_compounds);
            let blob = new Blob([JSON.stringify(this.chembl_search_result_compounds)], {type: "octet/stream"});
            let url = window.URL.createObjectURL(blob);
            let hiddenElement = document.createElement('a');
            hiddenElement.href = url;
            hiddenElement.target = '_blank';
            hiddenElement.download = 'myFile.txt';
            hiddenElement.click();
            window.URL.revokeObjectURL(url);
            blob = new Blob([JSON.stringify(this.chembl_calculated_pc_row_chemblid)], {type: "octet/stream"});
            url = window.URL.createObjectURL(blob);
            hiddenElement = document.createElement('a');
            hiddenElement.href = url;
            hiddenElement.target = '_blank';
            hiddenElement.download = 'myFile_pc.txt';
            hiddenElement.click();
            window.URL.revokeObjectURL(url); */

            this.chembl_running = false;
            this.chembl_structural_search_running = false;
            if (this.chembl_search_type_radio_value == 'similarity') {
              this.drawResults();
            }
          },
          error => {
            alert('Error retrieving ChEMBL substructures.');
            console.log('Error retrieving ChEMBL substructures:');
            console.log(error);
            this.chembl_search_result_compounds = chembl_compounds;

/*             console.log(this.chembl_search_result_compounds);
            let blob = new Blob([JSON.stringify(this.chembl_search_result_compounds)], {type: "octet/stream"});
            let url = window.URL.createObjectURL(blob);
            let hiddenElement = document.createElement('a');
            hiddenElement.href = url;
            hiddenElement.target = '_blank';
            hiddenElement.download = 'myFile.txt';
            hiddenElement.click();
            window.URL.revokeObjectURL(url);
            blob = new Blob([JSON.stringify(this.chembl_calculated_pc_row_chemblid)], {type: "octet/stream"});
            url = window.URL.createObjectURL(blob);
            hiddenElement = document.createElement('a');
            hiddenElement.href = url;
            hiddenElement.target = '_blank';
            hiddenElement.download = 'myFile_pc.txt';
            hiddenElement.click();
            window.URL.revokeObjectURL(url); */

            this.chembl_running = false;
            this.chembl_structural_search_running = false;
          },
          () => {
            subscript2.unsubscribe();
          }
        );
      },
      error => {
        alert('Error standardizing or converting SMILES to InChiKey');
        this.chembl_running = false;
        this.chembl_structural_search_running = false;
      },
      () => {
        subscript.unsubscribe();
      }
    );
  }

  raxFromCompoundButton(type: string = 'substructure') {
    this.chembl_structural_search_running = true;
    this.chembl_running = true;
    const old_chembl_search_string: string = this.chembl_search_string;
    const tc_compound: Compound = this.substructure_compound;

    if (typeof tc_compound !== 'undefined') {
      this.chembl_search_string = tc_compound.smiles;
      this.tc_compound = tc_compound;
      this.raxFromSmilesButton(false, type);
      this.chembl_search_string = old_chembl_search_string;
    } else {
      alert('Compound #' + this.selected_compound_int_id.toString() + 'not found.');
      this.chembl_structural_search_running = false;
      this.chembl_running = false;
    }
  }

  generateMoleculeImage(smiles: string) {
    const canvas_id = this.canvas_id;
    const canvas_id_2 = canvas_id+'_2';
    const smiles_drawer_size = this.smiles_drawer_size;
    const $canvas_elem_const = $('<canvas id="'+canvas_id+'">');
    const $canvas_elem_const2 = $('<canvas id="'+canvas_id_2+'">');
    let $elem = $('#' + this.parent_canvas_id);
    $elem.append($canvas_elem_const);
    $elem.append($canvas_elem_const2);
    const canvas_elem: any = $elem.children("#"+canvas_id)[0];
    const canvas_elem2: any = $elem.children("#"+canvas_id_2)[0];


    //draw molecules
    const options = {width: smiles_drawer_size, height: smiles_drawer_size};
    const smilesDrawer = new SmilesDrawer.Drawer(options);
    //const smiles = 'C1CCCCC1';
    SmilesDrawer.parse(smiles, function(tree) {
      smilesDrawer.draw(tree, canvas_id, 'light', false);
    });
    
    const ctx = canvas_elem2.getContext('2d');
    ctx.canvas.width = canvas_elem.width;
    ctx.canvas.height = canvas_elem.height;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0,  canvas_elem.width, canvas_elem.height);
    ctx.drawImage(canvas_elem, 0, 0);

    const data = canvas_elem2.toDataURL();
    $(canvas_elem).remove();
    $(canvas_elem2).remove();
    return data;
  }


  drawResults() {
    const type = this.chembl_search_type_radio_value;
    switch (type) {
      case 'similarity':
        setTimeout(()=>{
          this.chembl_search_result_compounds.forEach((ccompound,index) => {
            
            this.chembl_search_result_compounds_image_data.push(this.generateMoleculeImage(ccompound.compound.smiles));
          });
    
        },0);
        break;
      case 'substructure':
        setTimeout(()=>{
          this.chembl_search_result_compounds.forEach((ccompound,index) => {
            
            this.chembl_search_filtered_compounds_image_data.push(this.generateMoleculeImage(ccompound.compound.smiles));
          });
    
        },0);
        break;
      default:
        throw Error('Invalid ChEMBL search type "'+type+'".')
        break;
    } 

  }

  chemblSearchStringChange($event) {
    if (this.service.chEMBLSubstructureSearch(this.chembl_search_string, undefined, true)) {
      this.chembl_search_page_size = this.service.GET_DEFAULT_LIMIT;
    } else {
      this.chembl_search_page_size = this.service.POST_DEFAULT_LIMIT;
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

    if (this.service.chEMBLSubstructureSearch(this.substructure_compound.smiles, undefined, true)) {
      this.chembl_search_page_size = this.service.GET_DEFAULT_LIMIT;
    } else {
      this.chembl_search_page_size = this.service.POST_DEFAULT_LIMIT;
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
        this.chembl_search_count = count;
        this.chembl_search_offset = offset;
        this.chembl_search_total_count = total_count;
        return [offset, total_count, count];
      }
      let molecule_row: Object = {
        molecule_chembl_id: molecule.molecule_chembl_id,
        pref_name: molecule.pref_name
      };
      molecule_row['molecule_structures'] = {
        'canonical_smiles': molecule.molecule_structures.canonical_smiles
      };
      this.chembl_calculated_pc_row_chemblid[molecule.molecule_chembl_id] = this.chembl.getChEMBLCalculatedPCFromMoleculeData(molecule);

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
    this.chembl_search_count = count;
    this.chembl_search_offset = offset;
    this.chembl_search_total_count = total_count;
    return [offset, total_count, count];
  }

  chEMBLGetSubstrutureSearchMolecules(smiles: string, limit: number = 1000000, _count: number = 0, page_size: number  = null) {

    let chembl_molecule_rows$ = new AsyncSubject<Object>();
    let molecule_rows: Object[] = [];
    this.chembl_calculated_pc_row_chemblid = {};
    const subs = (<Observable<Object>>this.service.chEMBLSubstructureSearch(smiles, page_size)).subscribe(
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

  chEMBLGetSimilaritySearchMolecules(smiles: string, similarity:number,limit: number = 1000000, _count: number = 0, page_size: number  = null) {

    let chembl_molecule_rows$ = new AsyncSubject<Object>();
    let molecule_rows: Object[] = [];
    this.chembl_calculated_pc_row_chemblid = {};
    const subs = (<Observable<Object>>this.service.chEMBLSimilaritySearch(smiles,similarity,page_size)).subscribe(
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

  parseChEMBLGetActivityPCData(chembl_result: Object, activity_rows: Object[],
    chembl_activity_rows$: AsyncSubject<Object>, idx: number, count: number = 0,
    limit: number = 1000000, fields: Array<string> = null, assay_type = 'A') {

    if (fields != null) {
      chembl_result['activities'].forEach(activity => {
        if (count > limit) {
          return;
        }
        let activity_row: Object = {};
        this.chembl_activity_fields.forEach(field => {
          activity_row[field] = activity[field];
        });
        activity_row['assay_type'] = assay_type;
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
              this.parseChEMBLGetActivityPCData(chembl_result2, activity_rows, chembl_activity_rows$, idx, count, limit, fields, assay_type);
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

  chEMBLGetActivityPCDataByCompoundId(chembl_id: string, idx: number , fields: Array<string> = null, limit: number = 1000000, _count: number = 0, assay_type = 'A') {

        let chembl_activity_rows$ = new AsyncSubject<Object>();
        let activity_rows: Object[] = [];
        const subs = this.chembl.chEMBLGetActivityPCDataByCompoundId(chembl_id, assay_type).subscribe(
          chembl_result => {
            this.parseChEMBLGetActivityPCData(chembl_result, activity_rows, chembl_activity_rows$, idx, _count, limit, fields, assay_type);
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
        this.chembl_search_filtered_compounds = this.chembl_search_result_compounds;
        this.rdkit_similarity_running = false;
        this.rdkit_similarity_cutoff = 0;
        this.last_rdkit_similarity_cutoff = this.rdkit_similarity_cutoff;
        return;
    }
    this.chembl_search_filtered_compounds = [];
    let smiles_array: string[] = [];
    this.chembl_search_result_compounds.forEach(
      chembl_compound => {
        smiles_array.push(chembl_compound.compound.smiles);
      }
    );
    const subs = this.service.setFingerPrintSimilarityFromSmiles(this.chembl_search_smiles).subscribe(
      result => {
        const subs2 = this.service.similarityFromSmiles(smiles_array, this.rdkit_similarity_cutoff).subscribe(
          result2 => {
            let compounds: Array<ChEMBLCompound> = [];
            result2['molecules'].forEach(element => {
              compounds.push(this.chembl_search_result_compounds[element.index]);
            });
            this.chembl_search_filtered_compounds = compounds;
            this.last_rdkit_similarity_cutoff = this.rdkit_similarity_cutoff;
            this.rdkit_similarity_running = false;
            if (this.chembl_search_type_radio_value == 'substructure') {
              this.drawResults();
            }
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

  saveButton(type: string = 'substructure') {
    this.save_running = true;
    const compounds: Compound[] = [];
    this.saved_compounds = [];
    this.chembl_activity_errors = '';
    let chembl_search_compounds: ChEMBLCompound[];
    console.log('type:');
    console.log(type);
    console.log('this.chembl_search_result_compounds:');
    console.log(this.chembl_search_result_compounds);
    console.log('this.chembl_search_filtered_compounds:');
    console.log(this.chembl_search_filtered_compounds);
    switch (type) {
      case 'similarity':
        chembl_search_compounds = this.chembl_search_result_compounds;
        break;
      case 'substructure':
        chembl_search_compounds = this.chembl_search_filtered_compounds;
        break;
      default:
        throw Error('Invalid ChEMBL search type "'+type+'".')
        break;
    }
    chembl_search_compounds.forEach(chembl_compound => {
      compounds.push(chembl_compound.compound);
    });
    console.log('compounds');
    console.log(compounds);

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
    let done_count: number = 0;
    this.chembl_activity_rows_compound = {};
    let chembl_activity_downloaded$ = new AsyncSubject<string>();
  
    const subs = chembl_activity_downloaded$.subscribe(result => {

    });
    let idx: number = 0;
    console.log('saved_compounds');
    console.log(this.saved_compounds);
    this.saved_compounds.forEach(compound => {
      this.chembl_activity_rows_compound[idx] = {};
      this.chembl_activity_rows_compound[idx]['compound'] = compound;
      this.chembl_activity_rows_compound[idx]['chembl_activity_rows'] = [];
      const chembl_id = compound.chembl_id;
      if (this.chembl_calculated_pc_row_chemblid[chembl_id] !== null && typeof this.chembl_calculated_pc_row_chemblid[chembl_id] !== 'undefined') {
        this.chembl_activity_rows_compound[idx]['chembl_activity_rows'] = this.chembl_activity_rows_compound[idx]['chembl_activity_rows'].concat(this.chembl_calculated_pc_row_chemblid[chembl_id]);
      }
      const chembl_ADMETActivity_rows$ = this.chEMBLGetActivityPCDataByCompoundId(chembl_id, idx, this.chembl.chembl_activity_fields, undefined, undefined, 'A');
      const chembl_subs = chembl_ADMETActivity_rows$.subscribe(
        chembl_result => {
          let chembl_activity_rows: Object[] = this.chembl_activity_rows_compound[chembl_result['idx']]['chembl_activity_rows'];
          chembl_activity_rows = chembl_activity_rows.concat(chembl_result['activities']);
          this.chembl_activity_rows_compound[chembl_result['idx']]['chembl_activity_rows'] = chembl_activity_rows;
          const chembl_pc_rows$ = this.chEMBLGetActivityPCDataByCompoundId(chembl_id, idx, this.chembl.chembl_activity_fields,undefined,
            undefined, 'P');
          const chembl_subs2 = chembl_pc_rows$.subscribe(
            chembl_result2 => {
              chembl_activity_rows = chembl_activity_rows.concat(chembl_result2['activities']);          
              this.chembl_activity_rows_compound[chembl_result['idx']]['chembl_activity_rows'] = chembl_activity_rows;
              success_count++;
              done_count++;
              if (done_count >= this.saved_compounds.length) {
                this.chembl_running = false;
              }
            },
            error => {
              done_count++;
              if (done_count >= this.saved_compounds.length) {
                this.chembl_running = false;
              }
              chembl_subs2.unsubscribe();
              chembl_activity_downloaded$.next('error');
            },
            () => {
              chembl_activity_downloaded$.next('completed');
              chembl_subs2.unsubscribe();
            });
          },
          error => {
            chembl_subs.unsubscribe();
          },
          () => {
            chembl_subs.unsubscribe();
          }
        );
      idx++;
    });
    

  }

  saveActivities() {
    this.chembl_running = true;
    this.chembl_activity_errors = '';
    console.log(this.chembl_activity_rows_compound);
    const project = this.info.project;
    const ra_type = Compound.SOURCE_COMPOUND;
    const data_list: Array<Object[]> = [];
    const compounds: Compound[] = [];

    Object.keys(this.chembl_activity_rows_compound).sort((a, b) => Number(a) - Number(b)).forEach(idx => {
      const compound = this.chembl_activity_rows_compound[idx]['compound'];
      const chembl_activity_rows = this.chembl_activity_rows_compound[idx]['chembl_activity_rows'];
      if (chembl_activity_rows.length > 0 && chembl_activity_rows !== null && typeof chembl_activity_rows !== 'undefined') {
        compounds.push(compound);
        data_list.push(chembl_activity_rows);
      }
    });
    const subs = this.chembl.saveChemblDataMultiple(project,ra_type,compounds, data_list).subscribe(result => {
      this.chembl_running = false;
      alert('Activities saved succesfully.');
    },
    error => {
      console.log('Error while saving ChEMBL data');
      this.chembl_activity_errors += 'Error while saving ChEMBL data.';
      this.chembl_running = false;
      subs.unsubscribe();
    },
    () => {
      subs.unsubscribe();
    });
  }

  typeof(variable) {
    return typeof variable;
  }
  object_keys(obj: Object) {
    return Object.keys(obj);
  }
}
