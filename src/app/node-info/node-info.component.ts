import { Component, OnInit, ElementRef, ComponentRef, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import { IModalDialog, IModalDialogOptions, IModalDialogButton } from 'ngx-modal-dialog';
import {Globals} from '../globals';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NodeInfoService } from './node-info.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';



declare let jQuery: any;

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
];

@Component({
  selector: 'app-node-info',
  templateUrl: './node-info.component.html',
  styleUrls: ['./node-info.component.css']
})
export class NodeInfoComponent implements OnInit, IModalDialog, AfterViewInit {

  actionButtons: IModalDialogButton[];
  node: number;
  output = '';
  comments = '';
  input: Array<any> = [];
  resources: Array<any> = [];
  description: string;
  name: string;
  objectKeys = Object.keys;
  columnid = 1;
  columns: any;
  confirmed_columns: any;
  editInfoOut: Array<any>;
  nodeId: number;
  inline_comments = false;
  savecomment = false;
  savecontent = false;
  inline_output = false;
  show_inline = false;
  reference: ComponentRef<IModalDialog>;

  dtOptions: DataTables.Settings = {};
  public Editor = ClassicEditor;
  dtTrigger: Subject<any> = new Subject();
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  

  constructor(private el: ElementRef, public globals: Globals,
              private service: NodeInfoService) {   }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    // no processing needed
    this.actionButtons = [
      { text: 'Save', onAction: () => this.NodeCompleted( options.data.project, options.data.node_seq) },
      { text: 'Edit', onAction: () => this.NodeEdit() },
      { text: 'Close' }, // no special processing here
    ];
    options.actionButtons = this.actionButtons;
    console.log(options.data);
    this.input = options.data.inputs;
    this.output = options.data.outputs;
    this.comments = options.data.outputs_comments;
    this.name = options.data.name;
    this.nodeId = options.data.id;
    this.description = options.data.description;
    this.resources = options.data.resources;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.savecomment = true;
    this.savecontent = true;
  }

  NodeCompleted( project_id: number, node_id: number) {

    this.service.saveNode (project_id, node_id, this.output, this.comments).subscribe(
      result => {
        console.log(result);
      }
    );
    this.globals.change =  !this.globals.change;
    this.inline_output = true;
    this.inline_comments = true;

    return false;
  }

  NodeEdit() {
    this.inline_output = false;
    this.inline_comments = false;
    return false;
  }
}
