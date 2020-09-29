import { Component, OnInit, OnChanges, AfterViewInit, Input} from '@angular/core';
import * as Survey from "survey-angular";

declare let SmilesDrawer: any;

@Component({
  selector: 'app-molecule-picker',
  templateUrl: './molecule-picker.component.html',
  styleUrls: ['./molecule-picker.component.css']
})
export class MoleculePickerComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() smiles: Object[];
  @Input() identifier: string;

  

  public survey = Survey;
  public survey_model: Survey.Model;
  public canvas_id_prefix: String = 'tmp_canvas_molecule_picker_';
  public canvas_id: string;
  public parent_canvas_id: string;
  public survey_element_id_prefix: string = 'surveyElement_';
  public survey_element_id: string;
  public smiles_drawer_size: number = 200;
  public initialized_view: boolean = false;
  public json: Object = {
    "elements": [
        {
            "type": "imagepicker",
            "name": "choosepicture",
            "title": " ",
            "choices": []
        }
    ]
};
  constructor() { }

  ngOnInit() {
    
    this.canvas_id = this.canvas_id_prefix + this.identifier;
    this.parent_canvas_id = this.canvas_id + '_id_parent';
    this.survey_element_id = this.survey_element_id_prefix + this.identifier;
    //this.json['choices'] = this.choices;
    this.survey
    .StylesManager
    .applyTheme("bootstrap");

    this.survey.defaultBootstrapCss.navigationButton = "btn btn-green";
    this.survey_model = new Survey.Model(this.json);
    this.survey_model.showQuestionNumbers = "off";
    this.survey_model.showNavigationButtons = false;
/*     this.survey_model
    .onComplete
    .add(function (result) {
        document
            .querySelector('#surveyResult')
            .textContent = "Result JSON:\n" + JSON.stringify(result.data, null, 3);
    }); */

  }

  ngAfterViewInit() {
    this.initialized_view = true;
    this.drawSurvey();
  }

  ngOnChanges(change) {
    this.drawSurvey();
  }

  drawSurvey() {
    if (this.initialized_view) {
      let choices: Object[] = [];
      this.smiles.forEach(smiles => {
        const link = this.generateMoleculeImage(smiles['value']);
        choices.push({value: smiles['int_id'], imageLink: link});
      });
      this.json['elements'][0]['choices'] = choices;
      console.log(this.json);
      //$('#'+this.survey_element_id).remove();
      this.survey_model = new Survey.Model(this.json);
      this.survey_model.showQuestionNumbers = "off";
      this.survey_model.showNavigationButtons = false;
      this.survey
      .SurveyNG
      .render(this.survey_element_id, {model: this.survey_model});
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
