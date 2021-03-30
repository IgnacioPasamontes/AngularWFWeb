import { Component, OnInit, Input, AfterViewInit, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ChemblService } from './chembl.service';
import { Compound, CompoundService } from '../compound/compound.service';
import { TcCompoundsService } from '../tc-characterization/tc-compounds.service';
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';
import { AsyncSubject, Observable } from 'rxjs';
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_FACTORY } from '@angular/cdk/overlay/typings/overlay-directives';
import { Console } from 'console';


@Component({
  selector: 'app-chembl',
  templateUrl: './chembl.component.html',
  styleUrls: ['./chembl.component.css']
})
export class ChemblComponent implements OnInit, AfterViewInit {

  static ra_abbr_to_ra_type: Object = {tc: Compound.TARGET_COMPOUND, sc: Compound.SOURCE_COMPOUND};

  @Input() info;
  @Input() ra_type;
  public ra_compound_service: any;
  public chembl_running: boolean = false;
  public input_type_radio_value: string = 'compound';
  public input_type_radio_show: boolean = false;
  public chembl_search_string: string;
  public selected_compound_int_id: number;
  public chembl_item_list: Array<Object> = [];
  public chembl_selected_item_int_id_list: Array<number> = [];
  public binded_multiselect_id: string = 'chembl_chembl_ids';
  public chembl_current_item: Object;
  public chembl_item_text_dump: string;
  public chembl_item_copy_copy_selection_only: boolean;
  public chembl_content_item_textarea: any;
  public chembl_smiles: Object = {};
  public chembl_smiles_items: Array<Object> = [];
  public activity: string = '';
  public activity_compound: Compound;
  public activity_chembl_ids: Array<string>;
  public chembl_calculated_pc_row_chemblid: Object = {};
  public chembl_activity_fields: Array<string> = this.service.chembl_activity_fields;
  public chembl_displayed_activity_fields = this.service.chembl_displayed_activity_fields;
  public auto_chembl: boolean = false;
  public chembl_activity_rows: Array<Object> = [];
  public ngb_modal_opt: Object = {
    ariaLabelledBy: 'chembl-copy-clipboard-basic-title',
    windowClass: 'chembl-modal',
    centered: true
  };

  constructor(
      private service: ChemblService,
      private modalService: NgbModal,
      public tc_compounds: TcCompoundsService) { }

  ngOnInit() {

    switch (this.ra_type) {
      case 'tc': {
        this.ra_compound_service = this.tc_compounds;
        break;
      }

      case 'sc': {
        this.ra_compound_service = null;
        break;
      }
      default : {
        alert('Invalid CompoundComponent RA type.');
        break;
      }
    }
    this.ra_compound_service.getCompounds(this.info.project);
    const sub = this.ra_compound_service.compounds$.subscribe(
      result => {
        if (result) {
          if (result.length === 1) {
            this.selected_compound_int_id = result[0].int_id;
            this.auto_chembl = true;
            this.chemblIdFromCompoundButton();
          } else {
            this.selected_compound_int_id = undefined;
          }
        }
        

      },
      error => {
      }
    );

  }

  ngAfterViewInit() {
    this.setupMultiselect();
  }

  updateMultiSelect() {
    if (typeof this.binded_multiselect_id !== 'undefined' && this.binded_multiselect_id !== null) {
      const jquery_select = '#' + this.binded_multiselect_id;
      setTimeout(function() {
        (<any>$(jquery_select)).multiSelect('refresh');
      }.bind(this, jquery_select), 0);
    }

  }

  getSelectedFromMultiselect() {
    if (typeof this.binded_multiselect_id !== 'undefined' && this.binded_multiselect_id !== null) {
      const jquery_select = '#' + this.binded_multiselect_id;
      let selected_chembl_int_id_list = [];
      $(jquery_select).children("[selected='selected']").each(function() {
        selected_chembl_int_id_list.push(Number((<string>$(this).val()).replace(/^[0-9]+:\s+/, '')) + 0);
      });
      return selected_chembl_int_id_list;
    }
  }

  setCurrentItemIntId() {
    if (this.chembl_selected_item_int_id_list.length === 1 ) {
      const current_chembl_int_id = this.chembl_selected_item_int_id_list[0];
      const BreakException = {};
      try {
        this.chembl_item_list.forEach((item) => {
          if (item['int_id'] === current_chembl_int_id) {
            this.chembl_current_item = item;
            throw BreakException;
          }
        });
      } catch(e) {
        if (e !== BreakException) {throw e; }
      }
    }
  }

  initializeMultiSelect() {
    const multiselect_id = this.binded_multiselect_id;
    let jquery_select = '#' + multiselect_id;
    let jquery_select_ms = "#ms-" + multiselect_id;
    let selected_select_options = $(jquery_select).children();
    selected_select_options.removeAttr('selected');
    selected_select_options.prop('selected',false);
    let ms = $(jquery_select_ms); 
    $(jquery_select_ms).css('width','100%');
    $(jquery_select_ms).find(".ms-list").css('height', '100px');
  }

  updateSelectedItemsFromMultiselect() {
    this.chembl_selected_item_int_id_list =  this.getSelectedFromMultiselect();
    this.setCurrentItemIntId();
  }

  setupMultiselect() {
    const that = this;
    (<any>$('#' + this.binded_multiselect_id)).multiSelect({
      'afterInit': function() {that.initializeMultiSelect()},
      'afterSelect':
        function() {that.updateSelectedItemsFromMultiselect()},
      'afterDeselect':
        function() {that.updateSelectedItemsFromMultiselect()}
    });
    this.updateMultiSelect();
  }

  deleteSelection() {
    this.chembl_selected_item_int_id_list = [];
    this.chembl_current_item = undefined;
    this.updateMultiSelect();
  }

  setItemList(item_list: Array<Object>, has_no_duplicates: boolean = false) {
    this.chembl_item_list = item_list;
    this.deleteSelection();
  }

  private filterObjectListByKey(object_list: Array<Object>, key : string, values : Array<any>, inverted: boolean = false) {
    let j_key = {};
    values.forEach((value) => {
      j_key[value] = 0;
    })

    const filtered_object_list = object_list.filter((value, index, array) => {
      let is_in_j_key = j_key.hasOwnProperty(value[key]);
      return inverted ? !is_in_j_key : is_in_j_key;
    });
    return filtered_object_list;
  }

  filterListByIntId(item_list : Array<Object>, item_int_id_list: Array<number>, inverted: boolean = false) {
    let item_int_id_list_number : Array<number> = [];
    item_int_id_list.forEach((item_int_id) => {
      item_int_id_list_number.push(Number(item_int_id));
    });
    return this.filterObjectListByKey(item_list, 'int_id', item_int_id_list_number, inverted);
  }

  deleteItemsByIntId(int_id_list: Array<number>) {
      let selected_item = this.filterListByIntId(this.chembl_item_list, int_id_list);
      let value_list : Array<string> = [];
      selected_item.forEach((item) => {
        value_list.push(item['value']);
      });
      this.setItemList(this.filterObjectListByKey(this.chembl_item_list, 'value', value_list, true));
  }

  chemblDeleteSelectedItems() {
    this.deleteItemsByIntId(this.chembl_selected_item_int_id_list);
  }


  updateTextDump(copy_selection_only: boolean = true, item_value_only: boolean = false) {
    let item_list: Array<Object>;
    if (copy_selection_only) {
      item_list = this.filterListByIntId(this.chembl_item_list, this.chembl_selected_item_int_id_list);
    } else {
      item_list = this.chembl_item_list;
    }

    this.chembl_item_text_dump = '';
    let key : string;
    if (item_value_only) {
      key = 'value';
    } else {
      key = 'string_rep';
    }
    item_list.forEach((cas) => {
      this.chembl_item_text_dump += cas[key] + '\n';
    });
  }

  parseChEMBLGetActivityPCData(chembl_result: Object, activity_rows: Object[],
    chembl_activity_rows$: AsyncSubject<Object>, count: number = 0,
    limit: number = 1000000, fields: Array<string> = null, assay_type: string ='A') {

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

    chembl_activity_rows$.next({activities: activity_rows});

    if (chembl_result.hasOwnProperty('page_meta')) {
      if (chembl_result['page_meta'].hasOwnProperty('next')) {
        const next = chembl_result['page_meta'].next;
        if (typeof next !== 'undefined' && next !== null) {
          const subs = this.service.chEMBLGetADMETActivityDataNext(next).subscribe(
            chembl_result2 => {
              this.parseChEMBLGetActivityPCData(chembl_result2, activity_rows, chembl_activity_rows$, count, limit, fields);
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

  parseChEMBLSmilesData(chembl_result: Object, chembl_ids: string[],
    chembl_chembl_ids$: AsyncSubject<Object>, count: number = 0,
    limit: number = 1000000) {


    chembl_result['molecules'].forEach(molecule => {
      if (count > limit) {
        return;
      }
      chembl_ids.push(molecule['molecule_chembl_id']);
      count++;
    });


    

    if (chembl_result.hasOwnProperty('page_meta')) {
      if (chembl_result['page_meta'].hasOwnProperty('next')) {
        const next = chembl_result['page_meta'].next;
        if (typeof next !== 'undefined' && next !== null) {
          const subs = this.service.chEMBLSmilesGetDataNext(next).subscribe(
            chembl_result2 => {
              this.parseChEMBLSmilesData(chembl_result2, chembl_ids, chembl_chembl_ids$, count, limit);
              subs.unsubscribe();
            },
            error => {
              alert('Error retrieving data from ChEMBL.');
              subs.unsubscribe();
              chembl_chembl_ids$.error(error);
            }
          );
        } else {
          chembl_chembl_ids$.next(chembl_ids);
          chembl_chembl_ids$.complete();
        }
      } else {
        chembl_chembl_ids$.next(chembl_ids);
        chembl_chembl_ids$.complete();
      }
    } else {
      chembl_chembl_ids$.next(chembl_ids);
      chembl_chembl_ids$.complete();
    }
  }

  chEMBLGetActivityPCDataByCompoundId(chembl_id: string, fields: Array<string> = null, limit: number = 1000000, _count: number = 0, assay_type: string ='A') {

    let chembl_activity_rows$ = new AsyncSubject<Object>();
    let activity_rows: Object[] = [];
    const subs = this.service.chEMBLGetActivityPCDataByCompoundId(chembl_id, assay_type).subscribe(
      chembl_result => {
        this.parseChEMBLGetActivityPCData(chembl_result, activity_rows, chembl_activity_rows$, _count, limit, fields, assay_type);
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

  processChemblIds(chembl_ids: string[]) {
    this.setItemList(this.service.arrayToItemList(chembl_ids));
    const chembl_ids_length = chembl_ids.length;
    chembl_ids.forEach(chembl_id => {
      const chembl_smiles_sub = this.service.chEMBLGetMoleculeFromCompoundId(chembl_id).subscribe(molecule_result => {
        this.chembl_smiles[chembl_id] = this.service.getChEMBLSMILESFromMoleculeData(molecule_result);
        this.chembl_calculated_pc_row_chemblid[chembl_id] = this.service.getChEMBLCalculatedPCFromMoleculeData(molecule_result);
        console.log(this.chembl_calculated_pc_row_chemblid);
        if (Object.keys(this.chembl_smiles).length === this.chembl_item_list.length) {
          const items: Object[] = [];
          this.chembl_item_list.forEach( item => {
            items.push({'int_id': item['int_id'], 'value': this.chembl_smiles[item['value']], label: item['value']});
          });
          this.chembl_smiles_items = items;
          if (chembl_ids.length === 1 && this.chembl_item_list.length === 1) {
            this.chembl_selected_item_int_id_list = [this.chembl_smiles_items[0]['int_id']];
            this.activity_chembl_ids = [this.chembl_smiles_items[0]['label']]
            this.retrieveActivityData(undefined);
          }
        }

      },
      error => {
        alert('Cannot retrieve SMILES from ChEMBL entries.')
        chembl_smiles_sub.unsubscribe();
      },
      () => {
        chembl_smiles_sub.unsubscribe();
      }
      );
    });
  }



  chemblIdFromSmilesButton(reset_activity_compound: boolean = true) {
    this.chembl_running = true;
    this.setItemList([]);
    this.chembl_smiles_items = [];
    this.activity_chembl_ids = undefined;
    if (reset_activity_compound) {
      this.activity_compound = undefined;
    }
    this.chembl_activity_rows = [];
    this.chembl_smiles = {};
    this.chembl_calculated_pc_row_chemblid = {};
    this.activity = '';

    let search_smiles: string = this.chembl_search_string;
    const subscript = this.service.chemblSmilesToInChIKey(search_smiles).subscribe(
      result => {
        const unichem_subscript = this.service.uniChemGetSrcIdFromInChIKey(result.inchikey).subscribe(
          <Array>(unichem_result) => {
            let chembl_ids = this.service.getChEMBLIDFromUniChemData(unichem_result);
            if (chembl_ids.length > 0) {
              this.processChemblIds(chembl_ids);
            } else {
              this.service.chemblSmilesStandarize(search_smiles).subscribe(
                standarize_result => {
                  let chembl_chembl_ids$ = new AsyncSubject<string[]>();
                  let chembl_ids_subscript: any;
                  const chembl_subscript = (<Observable<Object>>this.service.chEMBLSmilesSearch(standarize_result.smiles)).subscribe(
                    chembl_result => {
                      this.parseChEMBLSmilesData(chembl_result,chembl_ids,chembl_chembl_ids$);
                      chembl_ids_subscript = chembl_chembl_ids$.subscribe(
                        result_chembl_ids => {
                          this.processChemblIds(result_chembl_ids);
                        },
                        error => {
                          alert('Error retrieving data from ChEMBL');
                          this.chembl_running = false;
                          // chembl_ids_subscript.unsubscribe();
                        },
                        () => {
                          this.chembl_running = false;
                          // chembl_ids_subscript.unsubscribe();
                        });
                    },
                    error => {
                      alert('Error retrieving data from ChEMBL');
                      this.chembl_running = false;
                      chembl_subscript.unsubscribe();
                    },
                    () => {
                      this.chembl_running = false;
                      chembl_subscript.unsubscribe();
                    });
                },
                error => {
                  alert('Error standarizing smiles');
                  this.chembl_running = false;
                  // chembl_ids_subscript.unsubscribe();
                },
                () => {
                  this.chembl_running = false;
                  // chembl_ids_subscript.unsubscribe();
                });
            }

          },
          error => {
            alert('Error retrieving data from UniChem');
            this.chembl_running = false;
            unichem_subscript.unsubscribe();
          },
          () => {
            this.chembl_running = false;
            unichem_subscript.unsubscribe();
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
  }


  chemblIdFromCompoundButtonRun(result:Compound[],old_chembl_search_string: string) {
    const BreakException = {};
    let activity_compound: Compound;
    try {
    
      result.forEach(compound => {

        if (compound.int_id === this.selected_compound_int_id) {
          activity_compound = compound;
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) { throw e; }
    }
    if (typeof activity_compound !== 'undefined') {
      this.chembl_search_string = activity_compound.smiles;

      this.activity_compound = activity_compound;
      this.chemblIdFromSmilesButton(false);
      this.chembl_search_string = old_chembl_search_string;
    } else {
        alert('Compound #' + this.selected_compound_int_id.toString() + 'not found.');
        this.chembl_running = false;
    }
  }

  chemblIdFromCompoundButton() {
    this.chembl_running = true;
    const old_chembl_search_string: string = this.chembl_search_string;
    
    const compounds = this.ra_compound_service.compounds$.getValue();
    
    if (typeof compounds !== 'undefined') {
      this.chemblIdFromCompoundButtonRun(compounds, old_chembl_search_string)
    }
    const sub = this.ra_compound_service.compounds$.subscribe(
      result => {
        if (result && result.length > 0) {
            this.chemblIdFromCompoundButtonRun(result, old_chembl_search_string);
            try {
              sub.unsubscribe();
            } catch (e) {}
        }

      },
      error => {
        alert('Compound #' + this.selected_compound_int_id.toString() + 'not found.');
      });

  }

  retrieveActivityData($event) {

    const chembl_ids = this.activity_chembl_ids;
    const chembl_activity_rows_obj: Object = {};
    let index: number = 0;
    const chembl_activity$ = new AsyncSubject<string[]>();
    const chembl_act_subs = chembl_activity$.subscribe(result => {
      let activity_rows: string = '';
      Object.keys(chembl_activity_rows_obj).sort((a, b) => Number(a) - Number(b)).forEach(idx => {
        this.chembl_activity_rows = this.chembl_activity_rows.concat(chembl_activity_rows_obj[idx]);
        console.log(idx+':');
        console.log(chembl_activity_rows_obj[idx]);
        chembl_activity_rows_obj[idx].forEach(activity => {
          activity_rows += '<tr>';
          this.chembl_displayed_activity_fields.forEach(field => {
            activity_rows += '<td>' + activity[field] + '</td>';
          });
          activity_rows += '<td>' + activity['assay_type'] + '</td>';
          activity_rows += '</tr>';
        });
      });
      this.activity = '<table><tr><th>Property</th><th>Value</th><th>Units</th><th>Description</th><th>Assay type</th></tr>'
       + activity_rows + '</table>';
    },
    error => {
      alert('Error retrieving data from ChEMBL');
      chembl_act_subs.unsubscribe();
    },
    () => {
      chembl_act_subs.unsubscribe();
    }
    );
    let success_count: number = 0;
    const chembl_ids_length = chembl_ids.length;
    chembl_ids.forEach(chembl_id => {
      chembl_activity_rows_obj[index] = this.chembl_calculated_pc_row_chemblid[chembl_id];
      index++;
      const chembl_ADMETActivity_rows$ = this.chEMBLGetActivityPCDataByCompoundId(chembl_id, this.chembl_activity_fields,undefined,
        undefined, 'A');
      const chembl_subs = chembl_ADMETActivity_rows$.subscribe(
        chembl_result => {
          let activ_rows: Object[] = chembl_result['activities'];
          const chembl_pc_rows$ = this.chEMBLGetActivityPCDataByCompoundId(chembl_id, this.chembl_activity_fields,undefined,
            undefined, 'P');
          const chembl_subs2 = chembl_pc_rows$.subscribe(
            chembl_result2 => {
              activ_rows = activ_rows.concat(chembl_result2['activities']);
              console.log(activ_rows);
              chembl_activity_rows_obj[index] = activ_rows;
              chembl_activity$.next(Object.keys(chembl_activity_rows_obj));
              success_count++;
              if (chembl_ids_length >= success_count) {
                chembl_activity$.complete();
              }
            },
            error => {
              chembl_activity$.error(error);
              this.chembl_running = false;
              chembl_subs2.unsubscribe();
            },
            () => {
              this.chembl_running = false;
              chembl_subs2.unsubscribe();

            }
          );
        },
        error => {
          chembl_activity$.error(error);
          this.chembl_running = false;
          chembl_subs.unsubscribe();

        },
        () => {
          chembl_subs.unsubscribe();
        }
      );
      index++;
    });

  }

  openCopy(content: TemplateRef<any>, copy_selection_only: boolean = true) {
    let closeResult: string;
    let copy_textarea_id: string = 'chembl_copy_textarea';
    let jquery_sel_copy_textarea_id: string = '#' + copy_textarea_id;
    this.chembl_item_copy_copy_selection_only = copy_selection_only;

    this.updateTextDump(copy_selection_only);
    this.chembl_content_item_textarea = this.chembl_item_text_dump;
    this.modalService.open(content, this.ngb_modal_opt).result.then((result) => {
      closeResult = 'Closed with: '+result;
      $(jquery_sel_copy_textarea_id).off('input');
    }, (reason) => {
      //ModalDismissReasons contains reason possible values
      $(jquery_sel_copy_textarea_id).off('input');
    });
    setTimeout(() => {
      const that = this;
      $(jquery_sel_copy_textarea_id).on('input', function(event)  {
        that.chembl_content_item_textarea = that.chembl_item_text_dump;
      })
    },0);
    setTimeout(function(copy_textarea_id) {
      (<any>document.getElementById(copy_textarea_id)).select();
      document.execCommand("copy");
    }.bind(this, copy_textarea_id),0);
  }

  chemblChangeContentItemTextarea() {
    if (this.chembl_content_item_textarea !== this.chembl_item_text_dump) {
      this.chembl_content_item_textarea = this.chembl_item_text_dump;
    }
  }

  compoundChange() {

  }

  typeof(variable: any) {
    return typeof variable;
  }

  saveActivityButton() {
    const chembl_ids: string[] = [];
    if (this.chembl_item_list.length === 1) {
      chembl_ids.push(this.chembl_item_list[0]['value']);
    } else {
      this.chembl_selected_item_int_id_list.forEach(int_id => {
        chembl_ids.push(this.chembl_item_list[int_id]['value']);
      });
    }
    const subs = this.service.saveChemblData(this.activity_compound, this.chembl_activity_rows, chembl_ids)
    .subscribe(result => {
      alert('ChEMBL data saved.');

    },
    error => {
      alert('Error while saving ChEMBL data.');
      subs.unsubscribe();
    },
    () => {
      subs.unsubscribe();
    });
  }

  moleculeSelected(molecules) {

    const int_ids: Array<number> = [];
    molecules.forEach(mol => {
      int_ids.push(mol.int_id);
    });

    this.chembl_selected_item_int_id_list = int_ids;
    this.setCurrentItemIntId();
    const selected_item = this.filterListByIntId(this.chembl_item_list, this.chembl_selected_item_int_id_list);
    const items = {};
    selected_item.forEach(item => {
      items[item['int_id']] = item['value'];
    });
    const chembl_ids: string[] = [];
    Object.keys(items).sort((a, b) => Number(a) - Number(b)).forEach(int_id => {
      chembl_ids.push(items[int_id]);
    });
    this.activity_chembl_ids = chembl_ids;
  }
}
