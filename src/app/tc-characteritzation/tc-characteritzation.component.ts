import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { TcCharacteritzationService } from './tc-characteritzation.service';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { parseString } from 'xml2js';
import { TestBed } from '@angular/core/testing';

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
  cas_current_text: string = '';
  cas_list: Array<Object>;
  //cas_list: Array<Object> = [{rgn:'test',string_class:'test',resolver:'test',classification:'test'}];
  selected_cas_int_id_list: Array<number> = [];
  cas_from_name_subscription: Subscription;


  constructor(private service: TcCharacteritzationService,) { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    (<any>$("#name2cas_cas")).multiSelect({
      'afterInit': 
        function() {
          $("#name2cas_cas").children("[selected='selected']").removeAttr('selected');
          $("#name2cas_cas").children("[selected='selected']").prop('selected',false);
          $("#ms-name2cas_cas").css('width','100%');
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
    setTimeout(function() {
      (<any>$("#name2cas_cas")).multiSelect('refresh');
    },0);
    
  }

  CASFromNameButton () {
    if (this.cas_from_name_running) {return}
    this.cas_from_name_running = true;
    this.selected_cas_int_id_list = [];
    this.cas_current = undefined;
    this.cas_current_text = '';
    this.cas_list = [];
    setTimeout(function() {
      (<any>$("#name2cas_cas")).multiSelect('refresh');
    },0);

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
          this.cas_from_name_executed = true;
          setTimeout(function() {
            (<any>$("#name2cas_cas")).multiSelect('refresh');
          },0);
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
      this.cas_current_text = 'Selected <b>'+this.cas_current['rgn']+'</b>, input_type="'+
      this.cas_current['string_class']+'", source="'+this.cas_current['resolver']+'":"'+
      this.cas_current['classification']+'"';
    }
  }

  CASFromNameRemoveDuplicatesButton() {
    let j = {};
    this.cas_list = this.cas_list.filter((value,index,array) => {
      if (j.hasOwnProperty(value['rgn'])) {
        return false;
      }
      j[value['rgn']] = 0;
      return true
    });
    this.cas_current = undefined;
    this.cas_current_text = '';
    this.selected_cas_int_id_list = [];
    setTimeout(function() {
      (<any>$("#name2cas_cas")).multiSelect('refresh');
    }.bind(this),0);
  }

  CASFromNameDeleteButton() {
    let j_int_id = {};
    this.selected_cas_int_id_list.forEach((cas_int_id) => {
      j_int_id[Number(cas_int_id)] = 0;
    })

    this.cas_list = this.cas_list.filter((value,index,array) => {
      return !j_int_id.hasOwnProperty(value['int_id']);
    });
    this.cas_current = undefined;
    this.cas_current_text = '';
    this.selected_cas_int_id_list = [];

    setTimeout(function() {
      (<any>$("#name2cas_cas")).multiSelect('refresh');
    },0);
  }

}
