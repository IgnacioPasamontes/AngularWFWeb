import { Component, OnInit, ElementRef, ComponentRef, ViewChild, AfterViewInit, Inject} from '@angular/core';
import { IModalDialog, IModalDialogOptions, IModalDialogButton } from 'ngx-modal-dialog';
import { Globals } from '../globals';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { NodeInfoService } from './node-info.service';
import * as ClassicEditor from '../../assets/js/ckeditor5/ckeditor.js';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Node1ProblemFormulationComponent } from '../node1-problem-formulation/node1-problem-formulation.component';



declare let jQuery: any;

@Component({
  selector: 'app-node-info',
  templateUrl: './node-info.component.html',
  styleUrls: ['./node-info.component.css']
})
export class NodeInfoComponent implements OnInit, AfterViewInit {

  info:any;
  inline_comments = false;
  savecomment = false;
  savecontent = false;
  inline_output = false;
  show_inline = false;

  dtOptions: DataTables.Settings = {};
  public Editor = ClassicEditor;
  public Editor_config : Object = {
    toolbar:['heading','bold','italic','link','bulletedList','numberedList',
              'blockQuote','insertTable','undo','redo','custom-element-tagname1'],
    removePlugins: ['ImageToolbar','oEmbed'],
    CustomElement:{
      items:[
        {
          tag: 'tagname1',
          placeholder: 'some text', 
          attributes:{name:'ABCD'}, 
          inline:false,
          editable:false
        }
      ]
    }
  };
  dtTrigger: Subject<any> = new Subject();

  dataSource:any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(Node1ProblemFormulationComponent,{static: false}) node1;
  displayedColumns: string[];
  columnsToDisplay: string[];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering

  constructor(private el: ElementRef, public globals: Globals,
              public service: NodeInfoService,
              public dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: Array<any>,
              ) {   }


  ngOnInit() {

    this.Editor.open_angular_file_upload_dialog = (tagname: string) => {
      alert(tagname+' added.');
    };

    this.info = this.data;

    if (this.info.inputs_comments == undefined) {this.info.inputs_comments = ''};
    if (this.info.outputs_comments == undefined) {this.info.outputs_comments = ''};

    this.dataSource = new MatTableDataSource(this.data['outputs']);

    this.displayedColumns = Object.keys(this.data['outputs'][0]);
    this.columnsToDisplay = this.displayedColumns.slice();
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.savecomment = true;
    this.savecontent = true;
  }

  NodeCompleted( project_id: number, node_id: number) {
    this.service.setNodeAsBusy(project_id,node_id);
    this.service.setNodeAsBusy(project_id,node_id,false);

    this.service.saveNode (this.info.project, this.info.node_seq, this.info.outputs,this.info.outputs_comments,this.globals.node_csrf_token[project_id][node_id]).subscribe(
      result => {
        this.service.setNodeAsBusy(project_id,node_id,false);
        this.globals.change =  !this.globals.change;
      }
    );
    switch(node_id) { 
      case 1: {
        this.service.setNodeAsBusy(project_id,node_id);
        this.node1.NodeCompleted(project_id);
        break; 
      } 
      default: { 
        //statements; 
        break; 
      } 
   } 

    
    this.inline_output = true;
    this.inline_comments = true;

    return false;
  }

  NodeEdit() {
    this.inline_output = false;
    this.inline_comments = false;
    return false;
  }

  onNoClick(): void {
    alert("Eeeeee");
    this.dialogRef.close();
  }

  addColumn() {
    const randomColumn = Math.floor(Math.random() * this.displayedColumns.length);
    this.columnsToDisplay.push(this.displayedColumns[randomColumn]);
  }

  removeColumn() {
    if (this.columnsToDisplay.length) {
      this.columnsToDisplay.pop();
    }
  }

  shuffle() {
    let currentIndex = this.columnsToDisplay.length;
    while (0 !== currentIndex) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // Swap
      let temp = this.columnsToDisplay[currentIndex];
      this.columnsToDisplay[currentIndex] = this.columnsToDisplay[randomIndex];
      this.columnsToDisplay[randomIndex] = temp;
    }
  }

}
