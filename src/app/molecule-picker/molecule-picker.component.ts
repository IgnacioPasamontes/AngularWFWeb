import { Component, OnInit, OnChanges, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import * as Survey from "survey-angular";




declare let SmilesDrawer: any;

@Component({
  selector: 'app-molecule-picker',
  templateUrl: './molecule-picker.component.html',
  styleUrls: ['./molecule-picker.component.css']
})
export class MoleculePickerComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() smiles: Object[];
  @Input() selection: number[];
  @Input() identifier: string;
  @Input() multiple: boolean;

  @Output() selected = new EventEmitter<Object[]>();

  public smiles_dict: Object = {};
  public data_element_data: string = '';
  public data_element_id_prefix: string = 'data_element_';
  public data_element_id: string;
  public survey = Survey;
  public survey_model: Survey.Model;
  public canvas_id_prefix: String = 'tmp_canvas_molecule_picker_';
  public canvas_id: string;
  public parent_canvas_id: string;
  public survey_element_id_prefix: string = 'surveyElement_';
  public survey_element_id: string;
  public smiles_drawer_size: number = 200;
  public initialized_view: boolean = false;
  public selected_smiles: string;
  public multiple_int: boolean = false;
  public json: Object = {
    "questions": [
        {
            "type": "imagepicker",
            "name": "choosemolecule",
            "title": " ",
            "choices": [],

        },
    ],
};
  constructor() { }

  ngOnInit() {
    if (typeof this.multiple !== 'undefined' && this.multiple !== null) {
      this.multiple_int = this.multiple;
    }
    this.canvas_id = this.canvas_id_prefix + this.identifier;
    this.data_element_id = this.data_element_id_prefix + this.identifier;
    this.parent_canvas_id = this.canvas_id + '_id_parent';
    this.survey_element_id = this.survey_element_id_prefix + this.identifier;
    this.survey
    .StylesManager
    .applyTheme("bootstrap");

    this.survey.defaultBootstrapCss.navigationButton = "btn btn-green";

  }


  surveySaveValue(sender, options) {
    const that: MoleculePickerComponent = sender.component;
    switch (options.name) {
      case "choosemolecule":
        const values: any = options.value;

        const values_final: Array<number> = [];
        const smiles: Array<Object> = [];
        if (!(values instanceof Array)) {
          values_final.push(Number(values));
        } else {
          values.forEach(val => {
            values_final.push(Number(val));
          });
        }

        if (typeof that.smiles_dict !== 'undefined') {
          if (Object.keys(that.smiles_dict).length > 0) {
            values_final.forEach(val => {
              smiles.push({int_id: val, smiles: that.smiles_dict[val]});
            });
            that.selected.emit(smiles);
          }
        }
        break;
    } 

  }

  ngAfterViewInit() {
    this.initialized_view = true;
    this.drawSurvey();
  }

  ngOnChanges(change) {
    this.drawSurvey();
    if (change.hasOwnProperty('smiles')) {
      if (typeof this.smiles !== 'undefined') {
        this.smiles.forEach((mol) => {
          this.smiles_dict[mol['int_id']] = mol['value'];
        });
      }
    }
  }

  drawSurvey() {
    if (this.initialized_view) {
      let choices: Object[] = [];
      this.smiles.forEach(mol => {
        const link = this.generateMoleculeImage(mol['value']);
        choices.push({value: mol['int_id'], imageLink: link});
      });
      this.json['questions'][0]['choices'] = choices;
      this.survey_model = new Survey.Model(this.json);
      let init_value: any;
      if (typeof this.selection !== 'undefined') {
        if (!this.multiple_int && this.selection.length > 0) {
          init_value = this.selection[0];
        } else {
          init_value = this.selection;
        }
        this.survey_model.data = {'choosemolecule': init_value};
      }
      this.survey_model.component = this;
      this.survey_model.showQuestionNumbers = "off";
      this.survey_model.showNavigationButtons = false;
      this.survey_model.multiSelect = this.multiple_int;
      this.survey
      .SurveyNG
      .render(this.survey_element_id, {model: this.survey_model, onValueChanged: this.surveySaveValue});
      $($("#"+this.survey_element_id).find(".sv_container").children()[0]).removeClass("mt-4");
    }
  }

  generateMoleculeImage(smiles: string) {
    const canvas_id = this.canvas_id;
    const $canvas_elem_const = $('<canvas id="'+canvas_id+'">');
    let $elem = $('#' + this.parent_canvas_id);
    $elem.append($canvas_elem_const);
    const canvas_elem: any = $elem.children("#"+canvas_id)[0];
    const elem = document.getElementById(canvas_id);

    //draw molecules
    const smiles_drawer_size = this.smiles_drawer_size;
    const options = {width: smiles_drawer_size, height: smiles_drawer_size};
    const smilesDrawer = new SmilesDrawer.Drawer(options);
    //const smiles = 'C1CCCCC1';
    SmilesDrawer.parse(smiles, function(tree) {
      smilesDrawer.draw(tree, canvas_id, 'light', false);
    });
    const data = canvas_elem.toDataURL();
    $(canvas_elem).remove();
    return data;
  }
}
