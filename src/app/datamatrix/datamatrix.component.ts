import { Component, OnInit, Input, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Globals } from '../globals';
import { DatamatrixService } from './datamatrix.service';
import { Compound, CompoundService } from '../compound/compound.service';
import { ResizeSensor } from 'css-element-queries';
import { DatamatrixTabsService } from '../datamatrix-tabs/datamatrix-tabs.service';

declare var $: JQueryStatic;
declare var Bokeh: any;

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];


@Component({
  selector: 'app-datamatrix',
  templateUrl: './datamatrix.component.html',
  styleUrls: ['./datamatrix.component.css']
})
export class DatamatrixComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() datamatrix_tabs_active_tab_name;
  @Input() projectName;
  @Input() redraw;
  @Input() workflow_scroll;
  @Input() change;
  public project_number: number;
  public ra_type_2_abbrev: Object = {};
  public displayedColumns: string[];
  public dataSource: MatTableDataSource<Object>;
  public columnsToDisplay: string[];
  public heatmap: string = '';
  public heatmap_bkp: string = '';
  public heatmap_scripts: string[] = [];
  public heatmap_id: string = '';
  public heatmap_div_reset: boolean = true;
  public heatmap_bokeh_document_timestamp: number;
  public scroll_refreshing: boolean = false;
  public response: string = '';

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(public globals: Globals,
              private service: DatamatrixService,
              public datamatrix_tabs: DatamatrixTabsService) { }

  ngOnInit() {
    this.heatmap_id = 'heatmap_datamatrix_bio_activity_project_' + this.project_number.toString();
    this.ra_type_2_abbrev[Compound.TARGET_COMPOUND] = 'tc';
    this.ra_type_2_abbrev[Compound.SOURCE_COMPOUND] = 'sc';



  }

  ngAfterViewInit() {
    //redraw connector lines when div.limit resizes

/*     const that = this;
    $(".limit").each(function() {
      let resize_sensor = new ResizeSensor(this, function () {
        console.log('resize3');
        that.drawHeatmap();
      });
    }); */
  }

  // || changes.hasOwnProperty('datamatrix_tabs_active_tab_name')

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('projectName')  || changes.hasOwnProperty('change')) {
      console.log('hola:');
      console.log(this.projectName);
      this.deleteHeatmap();
      this.project_number = this.globals.current_user.projects[this.projectName];
      if (typeof this.project_number === 'undefined') { return; }
/*       const subs = this.service.getMatrixData(this.project_number, Compound.TARGET_COMPOUND)
      .subscribe(result => {
        const data_matrix: Array<Object> = [];
        let field_names: Object = {};
        result.forEach(compound => {
          let fields: Object = {'Compound name': compound.name, 'num': compound.int_id, 'type': this.ra_type_2_abbrev[compound.ra_type]};
          compound.data_matrix[0].data_matrix_fields.forEach(field => {
            let unit: string = field.std_unit;
            let sep = ' ';
            if (field.std_unit === null || typeof field.std_unit === 'undefined') {
              unit = '';
              sep = '';
            }
            if (field.std_value === null) {
              fields[field.assay_id] = 'NaN';
            } else {
              fields[field.assay_id] = field.std_value.toString() + sep + unit;
            }
            field_names[field.assay_id] = 0; */
/*             if (field.std_value === null) {
              fields[field.name] = 'NaN';
            } else {
              fields[field.name] = field.std_value.toString() + sep + unit;
            }
            field_names[field.name] = 0; */
/*           });
          data_matrix.push(fields);
        });
        console.log(data_matrix);
        this.displayedColumns = ['Compound name', 'num', 'type'].concat(Object.keys(field_names).sort());
        this.dataSource = new MatTableDataSource<Object>(data_matrix);
        this.columnsToDisplay = this.displayedColumns.slice();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort; */
      this.heatmap = '';
      const subs = this.service.getMatrixHeatmap(this.project_number).subscribe(result => {
        this.heatmap = result.item;
        this.heatmap_bkp = result.item;
        this.heatmap_id = result.heatmap_div_id;
        if (result.status === 'No data') {
          this.response = 'No data';
        } else {
          this.response = '';
        }
/*           this.heatmap = result.div;
          this.heatmap_bkp = result.div;
          this.heatmap_scripts = result.scripts; */
        this.drawHeatmap();
      },
      error => {
        alert('Error retriving data matrix.');
        subs.unsubscribe();
      },
      () => {
        subs.unsubscribe();
      });
    }

/*     if (changes.hasOwnProperty('redraw')) {
      console.log('datamatrix_change');
      this.drawHeatmap();
    }
    if (changes.hasOwnProperty('workflow_scroll')) {
      if (!this.scroll_refreshing) {
        this.scroll_refreshing = true;
        console.log('datamatrix_change');
        this.heatmap = '';
        this.drawHeatmap();
        this.scroll_refreshing = false;
      }
    } */
  }

  drawHeatmap() {
    const something = Bokeh.embed.embed_item(this.heatmap);
    console.log('something');
    console.log(something);
/*     this.heatmap = this.heatmap_bkp;
    setTimeout(() => {
      this.heatmap_scripts.forEach( (script) => {
        eval(script);
      });
    }, 0); */
  }

  deleteHeatmap() {
    this.heatmap_div_reset = false;
    let doc_to_delete: Array<number> = [];
    Bokeh.documents.forEach( (doc, index) => {
      if (doc._title === this.heatmap_id) {
        doc.clear();
        doc_to_delete.push(index);
      }
    });
    doc_to_delete.forEach(idx => {
      Bokeh.documents.splice(idx, 1);
    });
    this.heatmap_div_reset = true;
  }

}
