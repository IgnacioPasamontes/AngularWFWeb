import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { TcCharacteritzationService } from './tc-characteritzation.service';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { parseString } from 'xml2js';
import { TestBed } from '@angular/core/testing';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tc-characteritzation',
  templateUrl: './tc-characteritzation.component.html',
  styleUrls: ['./tc-characteritzation.component.css']
})
export class TcCharacteritzationComponent implements OnInit, AfterViewInit {

  @Input() info;
  compound_name: string;
  cas_from_name_running: boolean = false;
  cas_from_name_executed: boolean = false;
  cas_current: Object;
  cas_list: Array<Object> = [];
  cas_set: Array<Object> = [];
  cas_text_dump: string;
  cas_show_cactvs_data: boolean = true;
  cas_copy_show_cactvs_data: boolean = true;
  cas_copy_copy_selection_only: boolean;
  //cas_list: Array<Object> = [{rgn:'test',string_class:'test',resolver:'test',classification:'test'}];
  selected_cas_int_id_list: Array<number> = [];
  cas_from_name_subscription: Subscription;


  constructor(private service: TcCharacteritzationService,
              private modalService: NgbModal) { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    (<any>$("#name2cas_cas")).multiSelect({
      'afterInit': 
        function() {
          $("#name2cas_cas").children("[selected='selected']").removeAttr('selected');
          $("#name2cas_cas").children("[selected='selected']").prop('selected',false);
          $("#ms-name2cas_cas").css('width','100%');
          $("#ms-name2cas_cas").find(".ms-list").css('height','100px');
        },
      'afterSelect':
        function() {
          this.selected_cas_int_id_list = this.getSelectedFromMultiselect();
          this.setCurrentCasIntId();
        }.bind(this),
      'afterDeselect':
        function() {
          this.selected_cas_int_id_list = this.getSelectedFromMultiselect();
          this.setCurrentCasIntId();
        }.bind(this),

    });
    this.update_multiselect();
    
  }

  update_multiselect() {
    setTimeout(function() {
      (<any>$("#name2cas_cas")).multiSelect('refresh');
    },0);
  }

  changeCASShowCactvsData() {
    this.selected_cas_int_id_list = [];
    this.cas_copy_show_cactvs_data = Boolean(this.cas_show_cactvs_data);
    this.update_multiselect();
    setTimeout(function() {
      (<any>$("#name2cas_cas")).multiSelect('deselect_all');
    },0);
  }

  updateCASSet(remove_duplicates : boolean = true) {
    let cas_list = this.cas_list;
    if (remove_duplicates) {
      cas_list = this.removeCASDuplicates(cas_list);
    }
    this.cas_set = cas_list;

  }

  CASFromNameButton () {
    if (this.cas_from_name_running) {return}
    this.cas_from_name_running = true;
    this.selected_cas_int_id_list = [];
    this.cas_current = undefined;
    this.cas_list = [];
    this.cas_set = [];
    this.update_multiselect();

    this.cas_from_name_subscription = this.service.getCASFromName(this.compound_name).subscribe(result => {
      parseString(result, function(err,result) {
        if (err !== null) {
          alert('Error while parsing CACTVS query');
          console.log('Error while parsing CACTVS query:');
          console.log(err);
          return;
        }
        
        if (!result.hasOwnProperty('request')) {
          alert("Error in CACTVS query");
          console.log("Error in CACTVS query. Response:");
          console.log(result);
        } else {
          this.cas_list = this.service.cactusXMLparsed(result);
          this.updateCASSet();
          this.cas_from_name_executed = true;
          this.update_multiselect();
        }

        
      }.bind(this));
      
    },
    error => {
      alert("Error in CACTVS query");
    },
    () => {
      this.cas_from_name_running = false;
      this.cas_from_name_subscription.unsubscribe();
    });
  }

  getSelectedFromMultiselect() {
    let selected_cas_int_id_list = [];
    $("#name2cas_cas").children("[selected='selected']").each(function() {
      selected_cas_int_id_list.push(Number((<string>$(this).val()).replace(/^[0-9]+:\s+/,''))+0);
    });
    return selected_cas_int_id_list;
    
  }

  setCurrentCasIntId() {
    if (this.selected_cas_int_id_list.length === 1 ) {
      const current_cas_int_id = this.selected_cas_int_id_list[0]
      const BreakException = {};
      try {
        this.cas_list.forEach((cas) => {
          if (cas['int_id'] === current_cas_int_id) {
            this.cas_current = cas;
            throw BreakException;
          }
        });
      } catch(e) {
        if (e !== BreakException) throw e;
      }
    }
  }

  removeCASDuplicates(cas_list: Array<Object>) {
    let j = {};
    let cas_list_set = cas_list.filter((value,index,array) => {
      if (j.hasOwnProperty(value['rgn'])) {
        return false;
      }
      j[value['rgn']] = 0;
      return true
    });
    return cas_list_set;
  }

  CASFromNameRemoveDuplicatesButton() {
    
    this.cas_list = this.removeCASDuplicates(this.cas_list);
    this.updateCASSet(false);
    this.cas_current = undefined;
    this.selected_cas_int_id_list = [];
    this.update_multiselect();
  }

  
  filterObjectListByKey(object_list: Array<Object>, key : string, values : Array<any>, inverted: boolean = false) {
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
  
  
  filterCASListByIntId(cas_list : Array<Object>, cas_int_id_list: Array<number>, inverted: boolean = false) {
    let cas_int_id_list_number : Array<number> = [];
    cas_int_id_list.forEach((cas_int_id) => {
      cas_int_id_list_number.push(Number(cas_int_id));
    });
    return this.filterObjectListByKey(cas_list, 'int_id', cas_int_id_list_number, inverted);
  }

  CASFromNameDeleteButton() {
    if (this.cas_show_cactvs_data) {
      this.cas_list = this.filterCASListByIntId(this.cas_list, this.selected_cas_int_id_list, true);
    } else {
      let selected_cas = this.filterCASListByIntId(this.cas_list,this.selected_cas_int_id_list);
      let rgn_list : Array<string> = [];
      selected_cas.forEach((cas) => {
        rgn_list.push(cas['rgn']);
      });
      this.cas_list = this.filterObjectListByKey(this.cas_list,'rgn',rgn_list,true);
    }
    this.updateCASSet();
    this.cas_current = undefined;
    this.selected_cas_int_id_list = [];

    this.update_multiselect();
  }

  updateCASTextDump(copy_selection_only: boolean = true, cas_rgn_only: boolean = false) {
    let cas_list: Array<Object>;
    if (copy_selection_only) {
      cas_list = this.filterCASListByIntId(this.cas_list, this.selected_cas_int_id_list);
    } else {
      cas_list = this.cas_list;
    }

    this.cas_text_dump = '';

    let key : string;
    if (cas_rgn_only) {
      key = 'rgn';
      cas_list = this.removeCASDuplicates(cas_list);
    } else {
      key = 'string_rep';
    }
    cas_list.forEach((cas) => {
      this.cas_text_dump += cas[key]+'\n';
    })
  }


  openCopy(content, copy_selection_only: boolean = true) {
    let closeResult: any;
    this.cas_copy_copy_selection_only = copy_selection_only;
    this.updateCASTextDump(copy_selection_only,!this.cas_copy_show_cactvs_data);
    setTimeout(function() {
      (<any>document.getElementById("name2cas-copy-textarea")).select();
      document.execCommand("copy");
    },0);
    this.modalService.open(content, {ariaLabelledBy: 'name2cas-copy-cliboard-basic-title', centered: true, windowClass: 'cas2name-modal'}).result.then((result) => {
      closeResult = `Closed with: ${result}`;
    }, (reason) => {
        //ModalDismissReasons contains reason possible values
    });
  }

  changeShowName2CasData() {
    this.updateCASTextDump(this.cas_copy_copy_selection_only, !this.cas_copy_show_cactvs_data);
  }
}
