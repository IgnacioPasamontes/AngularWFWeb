import { Component, OnInit, Input, AfterViewInit, TemplateRef, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

import { Name2casService } from './name2cas.service';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { parseString } from 'xml2js';
import { TestBed } from '@angular/core/testing';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgControlStatus } from '@angular/forms';
import { AsyncSubject, Subject, BehaviorSubject } from 'rxjs';


export class FromNameCACTVSInteface {
  constructor(cactus_output_key: string,
              binded_multiselect_id: string,
              service: Name2casService,
              show_cactvs_data: boolean = false,
              multiselect: boolean = false) {
    this.cactus_output_key = cactus_output_key;
    this.binded_multiselect_id = binded_multiselect_id;
    this._service = service;
    this.item_show_cactvs_data = show_cactvs_data,
    this.item_copy_show_cactvs_data = show_cactvs_data;
    this.multiselect = multiselect;
  }
  public from_name_running: boolean = false;
  public from_name_executed: boolean = false;
  public current_item: Object;
  public item_list: Array<Object> = [];
  public item_set: Array<Object> = [];
  public item_text_dump: string;
  public item_show_cactvs_data: boolean;
  public item_copy_show_cactvs_data: boolean;
  public item_copy_copy_selection_only: boolean;
  public selected_item_int_id_list: Array<number> = [];
  public item_from_name_subscription: Subscription;
  public content_item_textarea: string;
  public binded_multiselect_id: string;
  public cactus_output_key: string;
  private _service: Name2casService;
  public multiselect: boolean;

  private static filterObjectListByKey(object_list: Array<Object>, key : string, values : Array<any>, inverted: boolean = false) {
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

  static filterListByIntId(item_list : Array<Object>, item_int_id_list: Array<number>, inverted: boolean = false) {
    let item_int_id_list_number : Array<number> = [];
    item_int_id_list.forEach((item_int_id) => {
      item_int_id_list_number.push(Number(item_int_id));
    });
    return FromNameCACTVSInteface.filterObjectListByKey(item_list, 'int_id', item_int_id_list_number, inverted);
  }


  removeItemDuplicates(item_list: Array<Object>) {
    let j = {};
    let item_list_set = item_list.filter((value,index,array) => {
      if (j.hasOwnProperty(value['value'])) {
        return false;
      }
      j[value['value']] = 0;
      return true
    });
    return item_list_set;
  }


  updateItemSet(remove_duplicates : boolean = true) {
    let item_list = this.item_list;
    if (remove_duplicates) {
      item_list = this.removeItemDuplicates(item_list);
    }
    this.item_set = item_list;

  }

  updateMultiSelect() {
    if (typeof this.binded_multiselect_id !== 'undefined' && this.binded_multiselect_id !== null) {
      const jquery_select = '#'+this.binded_multiselect_id;
      setTimeout(function() {
        (<any>$(jquery_select)).multiSelect('refresh');
      }.bind(this, jquery_select),0);
    }

  }

  updateMultiSelectSelection() {
    if (typeof this.binded_multiselect_id !== 'undefined' && this.binded_multiselect_id !== null) {
      const jquery_select = '#'+this.binded_multiselect_id;
      const values: string[] = [];
      const selected_int_id_num: number = this.selected_item_int_id_list.length;
      if (selected_int_id_num > 0) {
        const int_id_2_val = this.getIntIdsFromMultiselect();
        this.selected_item_int_id_list.forEach((int_id) => {
          values.push(int_id_2_val[int_id]);
        });
      }
      setTimeout(function() {
        (<any>$(jquery_select)).multiSelect('deselect_all');
        if (selected_int_id_num > 0) {
          (<any>$(jquery_select)).multiSelect('select', values);
        }
      }.bind(this, jquery_select, values),0);
    }

  }

  getSelectedFromMultiselect() {
    if (typeof this.binded_multiselect_id !== 'undefined' && this.binded_multiselect_id !== null) {
      const jquery_select = '#' + this.binded_multiselect_id;
      let selected_cas_int_id_list = [];
      $(jquery_select).children("[selected='selected']").each(function() {
        selected_cas_int_id_list.push(Number((<string>$(this).val()).replace(/^[0-9]+:\s+/,''))+0);
      });
      return selected_cas_int_id_list;
    }
  }

  getIntIdsFromMultiselect() {
    if (typeof this.binded_multiselect_id !== 'undefined' && this.binded_multiselect_id !== null) {
      const jquery_select = '#' + this.binded_multiselect_id;
      const int_id_2_val: Object = {};
      $(jquery_select).children("option").each(function() {
        const val: string = (<string>$(this).val());
        const int_id: number = (Number(val.replace(/^[0-9]+:\s+/,''))+0);
        int_id_2_val[int_id] = val;
      });
      return int_id_2_val;
    }
  }

  setCurrentItemIntId() {
    if (this.selected_item_int_id_list.length === 1 ) {
      const current_cas_int_id = this.selected_item_int_id_list[0]
      const BreakException = {};
      try {
        this.item_list.forEach((item) => {
          if (item['int_id'] === current_cas_int_id) {
            this.current_item = item;
            throw BreakException;
          }
        });
      } catch(e) {
        if (e !== BreakException) throw e;
      }
    }
  }

  updateSelectedItemsFromMultiselect() {
    const int_id_list = this.getSelectedFromMultiselect();
    const int_id_2_val = this.getIntIdsFromMultiselect();
    if (!this.multiselect && int_id_list.length > 1) {
      this.updateMultiSelectSelection();
      return;
    }
    this.selected_item_int_id_list = int_id_list;
    this.setCurrentItemIntId();
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

  setupMultiselect() {
    const that = this;
    (<any>$('#'+this.binded_multiselect_id)).multiSelect({
      'afterInit': function() {that.initializeMultiSelect()},
      'afterSelect':
        function() {that.updateSelectedItemsFromMultiselect()},
      'afterDeselect':
        function() {that.updateSelectedItemsFromMultiselect()}
    });
    this.updateMultiSelect();
  }

  deleteSelection() {
    this.selected_item_int_id_list = [];
    this.current_item = undefined;
    this.updateMultiSelect();
  }

  setItemList(item_list: Array<Object>, has_no_duplicates: boolean = false) {
    this.item_list = item_list;
    if (item_list.length === 0) {
      this.item_set = [];
    } else {
      this.updateItemSet(!has_no_duplicates);
    }
    this.deleteSelection();
  }

  removeItemValueDuplicates() {
    this.setItemList(this.removeItemDuplicates(this.item_list), true);
  }



  deleteItemsByIntId(int_id_list: Array<number>,delete_same_value: Boolean = false) {
    if (!delete_same_value) {
      this.setItemList(this.item_list = FromNameCACTVSInteface.filterListByIntId(this.item_list, int_id_list, true));
    } else {
      let selected_item = FromNameCACTVSInteface.filterListByIntId(this.item_list, int_id_list);
      let value_list : Array<string> = [];
      selected_item.forEach((item) => {
        value_list.push(item['value']);
      });
      this.setItemList(FromNameCACTVSInteface.filterObjectListByKey(this.item_list,'value',value_list,true));
    }
  }

  deleteSelectedItems() {
    this.deleteItemsByIntId(this.selected_item_int_id_list, !this.item_show_cactvs_data);
  }

  fromName(search_string: string, termination_subject$?: Subject<any>, subject_emitted_value?: any) {
    if (this.from_name_running) {return; }
    this.from_name_running = true;
    this.setItemList([]);
    this.item_from_name_subscription = this._service.getFromName(search_string, this.cactus_output_key,
      ['compound_name', 'cas_number']).subscribe(result => {
      parseString(result, function(err, result) {
        if (err !== null) {
          alert('Error while parsing CACTVS query');
          console.log('Error while parsing CACTVS query:');
          console.log(err);
          return;
        }

        if (!result.hasOwnProperty('request')) {
          alert('Error in CACTVS query');
          console.log('Error in CACTVS query. Response:');
          console.log(result);
        } else {
          this.setItemList(this._service.cactusXMLparsed(result));
          this.from_name_executed = true;
          if (typeof termination_subject$ !== 'undefined' || termination_subject$ !== null) {
            if (!(termination_subject$.closed || termination_subject$.isStopped || termination_subject$.hasError)) {
              termination_subject$.next(subject_emitted_value);
            }
            if (!(termination_subject$.closed || termination_subject$.isStopped || termination_subject$.hasError)) {
              termination_subject$.complete();
            }


          }
        }
      }.bind(this));
    },
    error => {
      alert('Error in CACTVS query');
      this.from_name_running = false;
      this.item_from_name_subscription.unsubscribe();
    },
    () => {
      this.from_name_running = false;
      this.item_from_name_subscription.unsubscribe();
    });
  }

  updateTextDump(copy_selection_only: boolean = true, item_value_only: boolean = false) {
      let item_list: Array<Object>;
      if (copy_selection_only) {
        item_list = FromNameCACTVSInteface.filterListByIntId(this.item_list, this.selected_item_int_id_list);
      } else {
        item_list = this.item_list;
      }

      this.item_text_dump = '';

      let key : string;
      if (item_value_only) {
        key = 'value';
        item_list = this.removeItemDuplicates(item_list);
      } else {
        key = 'string_rep';
      }
      item_list.forEach((cas) => {
        this.item_text_dump += cas[key]+'\n';
      });
  }
}

@Component({
  selector: 'app-name2cas',
  templateUrl: './name2cas.component.html',
  styleUrls: ['./name2cas.component.css']
})
export class Name2casComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() info;
  search_string: string;
  search_string_type: string;
  search_type: any = ['compound_name', 'cas_number'];
  show_cactvs_data: boolean = false;
  cas: FromNameCACTVSInteface = new FromNameCACTVSInteface("cas","name2cas_cas", this.service, this.show_cactvs_data);
  smiles: FromNameCACTVSInteface = new FromNameCACTVSInteface("smiles","name2smiles_smiles", this.service, this.show_cactvs_data);
  compound_name: string;
  compound_name_int_id: number;
  compound_synonyms: Array<Object> = [];
  compound_name_executed: boolean = false;
  compound_name_running: boolean = false;
  public show_smiles: Boolean;
  cactus_interfaces: Object = {
      cas: this.cas,
      smiles: this.smiles
  };
  ngb_modal_opt_by_cactus_interface: Object = {
    cas: {
      ariaLabelledBy: 'name2cas-copy-clipboard-basic-title',
      windowClass: 'cas2name-modal'
    },
    smiles: {
      ariaLabelledBy: 'name2smiles-copy-clipboard-basic-title',
      windowClass: 'smiles2name-modal'
    }
  };
  copy_textarea_id_by_cactus_interface: Object = {
    cas: 'name2cas-copy-textarea',
    smiles: 'name2smiles-copy-textarea'
  };
  finished_cactvs_from_name_query$: Subject<string>;

  constructor(private service: Name2casService,
              private modalService: NgbModal,
              protected sanitizer: DomSanitizer) { }

  ngOnInit() {
    Object.keys(this.cactus_interfaces).forEach((interf) => {
      this.ngb_modal_opt_by_cactus_interface[interf]['centered'] = true; 
    });
  }

  ngAfterViewInit() {
    Object.keys(this.cactus_interfaces).forEach((interface_name) => {
      this.cactus_interfaces[interface_name].setupMultiselect();
    });
  }

  itemsFromNameButton() {
    this.compound_synonyms = [];
    this.compound_name = undefined;
    this.compound_name_int_id = undefined;
    if (this.finished_cactvs_from_name_query$ instanceof Subject) {
      if (this.finished_cactvs_from_name_query$.closed || this.finished_cactvs_from_name_query$.isStopped ||
          this.finished_cactvs_from_name_query$.hasError) {
      this.finished_cactvs_from_name_query$.complete();
      }
      this.finished_cactvs_from_name_query$.unsubscribe();
    }
    this.finished_cactvs_from_name_query$ = new Subject<string>();

    const subs = this.finished_cactvs_from_name_query$.subscribe(
      interface_name => {
        const default_value = {int_id: 0, value: this.search_string, html_rep: this.search_string, string_rep: this.search_string};
        if (this.cactus_interfaces[interface_name].item_list.length > 0) {
          if (this.cactus_interfaces[interface_name].item_list[0]['string_class'] === 'CAS Registry Number') {
            this.search_string_type = 'cas_number';
            this.compound_name_running = true;
            const  subs_synonyms = this.service.getFromName(this.search_string, 'names', 'cas', 120000).subscribe(
              result => {
                parseString(result, function(err, result) {
                  console.log(result);
                  console.log(err);
                  if (err !== null) {
                    alert('Error while parsing CACTVS query');
                    console.log('Error while parsing CACTVS query:');
                    console.log(err);
                    return;
                  }
                  if (!result.hasOwnProperty('request')) {
                    alert('Error in CACTVS query');
                    console.log('Error in CACTVS query. Response:');
                    console.log(result);
                  } else {
                    this.compound_synonyms = this.service.cactusXMLparsed(result);
                    if (this.compound_synonyms.length === 0) {
                      this.compound_synonyms.push(default_value);
                    }
                    this.compound_name_executed = true;
                  }
                  
                }.bind(this));
              },
              error => {
                alert('Error in CACTVS query');
                this.compound_name_running = false;
              },
              () => {
                console.log('search_string_type:');
                console.log(this.search_string_type);
                this.compound_name_running = false;
                subs_synonyms.unsubscribe();
              });

          } else if (this.cactus_interfaces[interface_name].item_list[0]['string_class'] === 'chemical name (CIR)' ||
                    this.cactus_interfaces[interface_name].item_list[0]['string_class'] === 'IUPAC name (OPSIN)') {
            this.search_string_type = 'compound_name';          
            this.compound_name = this.search_string;
            this.compound_synonyms.push(default_value);
            this.compound_name_int_id = 0;
            this.compound_name_executed = true;
            this.compound_name_running = false;
          } else {
            this.compound_name = this.search_string;
            this.compound_synonyms.push(default_value);
            this.compound_name_int_id = 0;
            this.compound_name_executed = true;
            this.compound_name_running = false;
          }
        }
      },
      error => {
        this.compound_name_running = false;
        subs.unsubscribe();
        this.finished_cactvs_from_name_query$.complete();
      }
    );
    Object.keys(this.cactus_interfaces).forEach((interface_name) => {
      this.cactus_interfaces[interface_name].fromName(this.search_string, this.finished_cactvs_from_name_query$, interface_name);
    });

  }

  changeItemsShowCactvsData() {
    Object.keys(this.cactus_interfaces).forEach((interface_name) => {
      this.cactus_interfaces[interface_name].item_show_cactvs_data = this.show_cactvs_data;
      this.cactus_interfaces[interface_name].item_copy_show_cactvs_data =
        Boolean(this.cactus_interfaces[interface_name].item_show_cactvs_data);
      this.cactus_interfaces[interface_name].deleteSelection();
    });
  }

  openCopy(content: TemplateRef<any>, cactus_interface_name: string, copy_selection_only: boolean = true) {
    let closeResult: string;
    let item: FromNameCACTVSInteface = this.cactus_interfaces[cactus_interface_name];
    let copy_textarea_id: string = this.copy_textarea_id_by_cactus_interface[cactus_interface_name];
    let jquery_sel_copy_textarea_id: string = '#' + copy_textarea_id;
    item.item_copy_copy_selection_only = copy_selection_only;

    item.updateTextDump(copy_selection_only, !item.item_copy_show_cactvs_data); 
    item.content_item_textarea = item.item_text_dump;
    this.modalService.open(content, this.ngb_modal_opt_by_cactus_interface[cactus_interface_name]).result.then((result) => {
      closeResult = 'Closed with: ' + result;
      $(jquery_sel_copy_textarea_id).off('input');
    }, (reason) => {
      // ModalDismissReasons contains reason possible values
      $(jquery_sel_copy_textarea_id).off('input');
    });
    setTimeout(() => {
      const that = this;
      $(jquery_sel_copy_textarea_id).on('input', function(event)  {
        item.content_item_textarea = item.item_text_dump;
      })
    },0);
    setTimeout(function(copy_textarea_id) {
      (<any>document.getElementById(copy_textarea_id)).select();
      document.execCommand('copy');
    }.bind(this, copy_textarea_id), 0);
  }


  changeShowName2ItemData(item: FromNameCACTVSInteface) {
    item.updateTextDump(item.item_copy_copy_selection_only, !item.item_copy_show_cactvs_data);
    item.content_item_textarea = item.item_text_dump;
  }


  changeContentItemTextarea(item: FromNameCACTVSInteface) {
    if (item.content_item_textarea !== item.item_text_dump) {
      item.content_item_textarea = item.item_text_dump;
    }
  }
  compoundNameChange($event: any) {
    const item = FromNameCACTVSInteface.filterListByIntId(this.compound_synonyms, [this.compound_name_int_id])[0];
    this.compound_name = item['value'];
  }

  moleculeSelected(molecules) {
    console.log('selecting');
    const int_ids: Array<number> = [];
    molecules.forEach(mol => {
      int_ids.push(mol.int_id);
    });
    console.log(int_ids);
    this.smiles.selected_item_int_id_list = int_ids;
    this.smiles.setCurrentItemIntId();
    this.smiles.updateMultiSelectSelection();
  }

  ngOnDestroy() {

  }

}
