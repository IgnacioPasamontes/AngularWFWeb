import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { TcCharacterizationService } from './tc-characterization.service';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { parseString } from 'xml2js';
import { TestBed } from '@angular/core/testing';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tc-characterization',
  templateUrl: './tc-characterization.component.html',
  styleUrls: ['./tc-characterization.component.css']
})
export class TcCharacterizationComponent implements OnInit, AfterViewInit {

  @Input() info;
  search_string: string;
  search_type: string = 'compound_name';
  cas_from_name_running: boolean = false;
  cas_from_name_executed: boolean = false;
  cas_current: Object;
  cas_list: Array<Object> = [];
  cas_set: Array<Object> = [];
  cas_text_dump: string;
  cas_show_cactvs_data: boolean = true;
  cas_copy_show_cactvs_data: boolean = true;
  cas_copy_copy_selection_only: boolean;
  selected_cas_int_id_list: Array<number> = [];
  cas_from_name_subscription: Subscription;
  content_cas_textarea: string;

  smiles_from_name_running: boolean = false;
  smiles_from_name_executed: boolean = false;
  smiles_current: Object;
  smiles_list: Array<Object> = [];
  smiles_set: Array<Object> = [];
  smiles_text_dump: string;
  smiles_show_cactvs_data: boolean = this.cas_show_cactvs_data;
  smiles_copy_show_cactvs_data: boolean = true;
  smiles_copy_copy_selection_only: boolean;
  selected_smiles_int_id_list: Array<number> = [];
  smiles_from_name_subscription: Subscription;
  content_smiles_textarea: string;


  constructor(private service: TcCharacterizationService,
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
          this.selected_cas_int_id_list = this.getSelectedCASFromMultiselect();
          this.setCurrentCasIntId();
        }.bind(this),
      'afterDeselect':
        function() {
          this.selected_cas_int_id_list = this.getSelectedCASFromMultiselect();
          this.setCurrentCasIntId();
        }.bind(this),

    });
    this.updateCASMultiselect();

    (<any>$("#name2smiles_smiles")).multiSelect({
      'afterInit': 
        function() {
          $("#name2smiles_smiles").children("[selected='selected']").removeAttr('selected');
          $("#name2smiles_smiles").children("[selected='selected']").prop('selected',false);
          $("#ms-name2smiles_smiles").css('width','100%');
          $("#ms-name2smiles_smiles").find(".ms-list").css('height','100px');
        },
      'afterSelect':
        function() {
          this.selected_smiles_int_id_list = this.getSelectedSmilesFromMultiselect();
          this.setCurrentSmilesIntId();
        }.bind(this),
      'afterDeselect':
        function() {
          this.selected_smiles_int_id_list = this.getSelectedSmilesFromMultiselect();
          this.setCurrentSmilesIntId();
        }.bind(this),

    });
    this.updateSmilesMultiselect();
    
  }

  CASandSmilesFromNameButton() {
    this.CASFromNameButton();
    this.smilesFromNameButton();
  }

  changeCASandSmilesShowCactvsData() {
    this.smiles_show_cactvs_data = this.cas_show_cactvs_data;
    this.changeCASShowCactvsData();
    this.changeSmilesShowCactvsData()
  }

  updateCASMultiselect() {
    setTimeout(function() {
      (<any>$("#name2cas_cas")).multiSelect('refresh');
    },0);
  }

  changeCASShowCactvsData() {
    this.selected_cas_int_id_list = [];
    this.cas_copy_show_cactvs_data = Boolean(this.cas_show_cactvs_data);
    this.updateCASMultiselect();
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
    this.updateCASMultiselect();

    this.cas_from_name_subscription = this.service.getCASFromName(this.search_string,this.search_type).subscribe(result => {
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
          this.updateCASMultiselect();
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

  getSelectedCASFromMultiselect() {
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
      if (j.hasOwnProperty(value['value'])) {
        return false;
      }
      j[value['value']] = 0;
      return true
    });
    return cas_list_set;
  }

  CASFromNameRemoveDuplicatesButton() {
    
    this.cas_list = this.removeCASDuplicates(this.cas_list);
    this.updateCASSet(false);
    this.cas_current = undefined;
    this.selected_cas_int_id_list = [];
    this.updateCASMultiselect();
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
        rgn_list.push(cas['value']);
      });
      this.cas_list = this.filterObjectListByKey(this.cas_list,'value',rgn_list,true);
    }
    this.updateCASSet();
    this.cas_current = undefined;
    this.selected_cas_int_id_list = [];

    this.updateCASMultiselect();
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
      key = 'value';
      cas_list = this.removeCASDuplicates(cas_list);
    } else {
      key = 'string_rep';
    }
    cas_list.forEach((cas) => {
      this.cas_text_dump += cas[key]+'\n';
    })
  }


  openCASCopy(content, copy_selection_only: boolean = true) {
    let closeResult: any;
    this.cas_copy_copy_selection_only = copy_selection_only;
    this.updateCASTextDump(copy_selection_only,!this.cas_copy_show_cactvs_data);
    setTimeout(function() {
      (<any>document.getElementById("name2cas-copy-textarea")).select();
      document.execCommand("copy");
    },0);
    this.content_cas_textarea = this.cas_text_dump;
    this.modalService.open(content, {ariaLabelledBy: 'name2cas-copy-cliboard-basic-title', centered: true, windowClass: 'cas2name-modal'}).result.then((result) => {
      closeResult = `Closed with: ${result}`;
      $("#name2cas-copy-textarea").off('input');
    }, (reason) => {
      //ModalDismissReasons contains reason possible values
      $("#name2cas-copy-textarea").off('input');
    });
    setTimeout(() => {
      const that = this;
      $("#name2cas-copy-textarea").on('input', function(event)  {
        that.content_cas_textarea = that.cas_text_dump;
      })
    },0);
  }

  changeShowName2CasData() {
    this.updateCASTextDump(this.cas_copy_copy_selection_only, !this.cas_copy_show_cactvs_data);
    this.content_cas_textarea = this.cas_text_dump;
  }

  changeContentCASTextarea() {
    if (this.content_cas_textarea !== this.cas_text_dump) {
      this.content_cas_textarea = this.cas_text_dump
    }
  }


  updateSmilesMultiselect() {
    setTimeout(function() {
      (<any>$("#name2smiles_smiles")).multiSelect('refresh');
    },0);
  }

  changeSmilesShowCactvsData() {
    this.selected_smiles_int_id_list = [];
    this.smiles_copy_show_cactvs_data = Boolean(this.smiles_show_cactvs_data);
    this.updateSmilesMultiselect();
    setTimeout(function() {
      (<any>$("#name2smiles_smiles")).multiSelect('deselect_all');
    },0);
  }

  updateSmilesSet(remove_duplicates : boolean = true) {
    let smiles_list = this.smiles_list;
    if (remove_duplicates) {
      smiles_list = this.removeSmilesDuplicates(smiles_list);
    }
    this.smiles_set = smiles_list;

  }

  smilesFromNameButton () {
    if (this.smiles_from_name_running) {return}
    this.smiles_from_name_running = true;
    this.selected_smiles_int_id_list = [];
    this.smiles_current = undefined;
    this.smiles_list = [];
    this.smiles_set = [];
    this.updateSmilesMultiselect();

    this.smiles_from_name_subscription = this.service.getSmilesFromName(this.search_string, this.search_type).subscribe(result => {
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
          this.smiles_list = this.service.cactusXMLparsed(result);
          this.updateSmilesSet();
          this.smiles_from_name_executed = true;
          this.updateSmilesMultiselect();
        }

        
      }.bind(this));
      
    },
    error => {
      alert("Error in CACTVS query");
    },
    () => {
      this.smiles_from_name_running = false;
      this.smiles_from_name_subscription.unsubscribe();
    });
  }

  getSelectedSmilesFromMultiselect() {
    let selected_smiles_int_id_list = [];
    $("#name2smiles_smiles").children("[selected='selected']").each(function() {
      selected_smiles_int_id_list.push(Number((<string>$(this).val()).replace(/^[0-9]+:\s+/,''))+0);
    });
    return selected_smiles_int_id_list;
    
  }

  setCurrentSmilesIntId() {
    if (this.selected_smiles_int_id_list.length === 1 ) {
      const current_smiles_int_id = this.selected_smiles_int_id_list[0]
      const BreakException = {};
      try {
        this.smiles_list.forEach((smiles) => {
          if (smiles['int_id'] === current_smiles_int_id) {
            this.smiles_current = smiles;
            throw BreakException;
          }
        });
      } catch(e) {
        if (e !== BreakException) throw e;
      }
    }
  }

  removeSmilesDuplicates(smiles_list: Array<Object>) {
    let j = {};
    let smiles_list_set = smiles_list.filter((value,index,array) => {
      if (j.hasOwnProperty(value['value'])) {
        return false;
      }
      j[value['value']] = 0;
      return true
    });
    return smiles_list_set;
  }

  smilesFromNameRemoveDuplicatesButton() {
    
    this.smiles_list = this.removeSmilesDuplicates(this.smiles_list);
    this.updateSmilesSet(false);
    this.smiles_current = undefined;
    this.selected_smiles_int_id_list = [];
    this.updateSmilesMultiselect();
  }

  filterSmilesListByIntId(smiles_list : Array<Object>, smiles_int_id_list: Array<number>, inverted: boolean = false) {
    let smiles_int_id_list_number : Array<number> = [];
    smiles_int_id_list.forEach((smiles_int_id) => {
      smiles_int_id_list_number.push(Number(smiles_int_id));
    });
    return this.filterObjectListByKey(smiles_list, 'int_id', smiles_int_id_list_number, inverted);
  }

  smilesFromNameDeleteButton() {
    if (this.smiles_show_cactvs_data) {
      this.smiles_list = this.filterSmilesListByIntId(this.smiles_list, this.selected_smiles_int_id_list, true);
    } else {
      let selected_smiles = this.filterSmilesListByIntId(this.smiles_list,this.selected_smiles_int_id_list);
      let smiles_list : Array<string> = [];
      selected_smiles.forEach((smiles) => {
        smiles_list.push(smiles['value']);
      });
      this.smiles_list = this.filterObjectListByKey(this.smiles_list,'value',smiles_list,true);
    }
    this.updateSmilesSet();
    this.smiles_current = undefined;
    this.selected_smiles_int_id_list = [];

    this.updateSmilesMultiselect();
  }

  updateSmilesTextDump(copy_selection_only: boolean = true, smiles_smiles_only: boolean = false) {
    let smiles_list: Array<Object>;
    if (copy_selection_only) {
      smiles_list = this.filterSmilesListByIntId(this.smiles_list, this.selected_smiles_int_id_list);
    } else {
      smiles_list = this.smiles_list;
    }

    this.smiles_text_dump = '';

    let key : string;
    if (smiles_smiles_only) {
      key = 'value';
      smiles_list = this.removeSmilesDuplicates(smiles_list);
    } else {
      key = 'string_rep';
    }
    smiles_list.forEach((smiles) => {
      this.smiles_text_dump += smiles[key]+'\n';
    })
  }


  openSmilesCopy(content, copy_selection_only: boolean = true) {
    let closeResult: any;
    this.smiles_copy_copy_selection_only = copy_selection_only;
    this.updateSmilesTextDump(copy_selection_only,!this.smiles_copy_show_cactvs_data);
    setTimeout(function() {
      (<any>document.getElementById("name2smiles-copy-textarea")).select();
      document.execCommand("copy");
    },0);

    this.content_smiles_textarea = this.smiles_text_dump;
    this.modalService.open(content, {ariaLabelledBy: 'name2smiles-copy-cliboard-basic-title', centered: true, windowClass: 'smiles2name-modal'}).result.then((result) => {
      $("#name2smiles-copy-textarea").off('input');
      closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //ModalDismissReasons contains reason possible values
      $("#name2smiles-copy-textarea").off('input');
    });
    setTimeout(() => {
      const that = this;
      $("#name2smiles-copy-textarea").on('input', function(event)  {
        that.content_smiles_textarea = that.smiles_text_dump;
      })
    },0);

  }

  changeShowName2SmilesData() {
    this.updateSmilesTextDump(this.smiles_copy_copy_selection_only, !this.smiles_copy_show_cactvs_data);
    this.content_smiles_textarea = this.smiles_text_dump;
  }
  
  changeContentSmilesTextarea() {
    if (this.content_smiles_textarea !== this.smiles_text_dump) {
      this.content_smiles_textarea = this.smiles_text_dump
    }
  }
}
