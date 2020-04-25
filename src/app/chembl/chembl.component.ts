import { Component, OnInit, Input, AfterViewInit, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ChemblService } from './chembl.service';
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';
import { AsyncSubject, BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-chembl',
  templateUrl: './chembl.component.html',
  styleUrls: ['./chembl.component.css']
})
export class ChemblComponent implements OnInit, AfterViewInit {
  @Input() info;
  public chembl_running: boolean = false;
  public chembl_search_string: string;
  public chembl_item_list: Array<Object> = [];
  public chembl_selected_item_int_id_list: Array<number> = [];
  public binded_multiselect_id: string = 'chembl_chembl_ids';
  public chembl_current_item: Object;
  public chembl_item_text_dump: string;
  public chembl_item_copy_copy_selection_only: boolean;
  public chembl_content_item_textarea: any;
  public activity: string = '';
  public chembl_activity_fields: Array<string> = ['standard_type', 'standard_value', 'standard_units', 'assay_description'];
  public chembl_activity_rows: Array<Object> = [];
  public ngb_modal_opt: Object = {
    ariaLabelledBy: 'chembl-copy-clipboard-basic-title',
    windowClass: 'chembl-modal',
    centered: true
  };

  constructor(
      private service: ChemblService,
      private modalService: NgbModal) { }

  ngOnInit() {

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
        if (e !== BreakException) throw e;
      }
    }
  }

  initializeMultiSelect() {
    const multiselect_id = this.binded_multiselect_id;
    let jquery_select = '#'+ multiselect_id;
    let jquery_select_ms = "#ms-" + multiselect_id;
    let selected_select_options = $(jquery_select).children();
    selected_select_options.removeAttr('selected');
    selected_select_options.prop('selected',false);
    let ms = $(jquery_select_ms); 
    $(jquery_select_ms).css('width','100%');
    $(jquery_select_ms).find(".ms-list").css('height','100px');
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

    let filtered_object_list = object_list.filter((value,index,array) => {
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

  parseChEMBLGetADMETActivityData(chembl_result: Object, activity_rows: Object[],
     chembl_activity_rows$: AsyncSubject<Object>, count: number = 0,
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

    chembl_activity_rows$.next({activities: activity_rows});

    if (chembl_result.hasOwnProperty('page_meta')) {
      if (chembl_result['page_meta'].hasOwnProperty('next')) {
        const next = chembl_result['page_meta'].next;
        if (typeof next !== 'undefined' && next !== null) {
          const subs = this.service.chEMBLGetADMETActivityDataNext(next).subscribe(
            chembl_result2 => {
              this.parseChEMBLGetADMETActivityData(chembl_result2, activity_rows, chembl_activity_rows$, count, limit, fields);
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

  chEMBLGetADMETActivityDataByCompoundId(chembl_id: string, fields: Array<string> = null, limit: number = 1000000, _count: number = 0) {
        let chembl_activity_rows$ = new AsyncSubject<Object>();
        let activity_rows: Object[] = [];
        const subs = this.service.chEMBLGetADMETActivityDataByCompoundId(chembl_id).subscribe(
          chembl_result => {
            this.parseChEMBLGetADMETActivityData(chembl_result, activity_rows, chembl_activity_rows$, _count, limit, fields);
            subs.unsubscribe();
          },
          error => {
            alert('Error retrieving data from ChEMBL.');
            subs.unsubscribe();
            chembl_activity_rows$.error(error);
          }
        );
        return chembl_activity_rows$.asObservable();
  }

  chemblIdFromSmilesButton() {
    this.chembl_running = true;
    this.setItemList([]);
    const subscript = this.service.chemblSmilesToInChIKey(this.chembl_search_string).subscribe(
      result => {
        const unichem_subscript = this.service.uniChemGetSrcIdFromInChIKey(result.inchikey).subscribe(
          <Array> (unichem_result) => {
            const chembl_ids = this.service.getChEMBLIDFromUniChemData(unichem_result);
            this.setItemList(this.service.arrayToItemList(chembl_ids));
            this.chembl_activity_rows = [];
            const chembl_subs = this.chEMBLGetADMETActivityDataByCompoundId(chembl_ids[0], this.chembl_activity_fields).subscribe(
              chembl_result => {
                let activity_rows: string = '';
                chembl_result["activities"].forEach(activity => {
                  activity_rows += '<tr>';
                  this.chembl_activity_fields.forEach(field => {
                    activity_rows += '<td>' + activity[field] + '</td>';
                  });
                  activity_rows += '</tr>';
                });

                this.activity = '<table><tr><th>Property</th><th>Value</th><th>Units</th><th>Description</th></tr>'
                 + activity_rows + '</table>';
              },
              error => {
                alert('Error retrieving data from ChEMBL');
                this.chembl_running = false;
                chembl_subs.unsubscribe();


              },
              () => {
                this.chembl_running = false;
                chembl_subs.unsubscribe();
              }
            );
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


}
