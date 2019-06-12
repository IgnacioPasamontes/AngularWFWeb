import { Component, OnInit, ElementRef, ComponentRef, ViewChild, AfterViewInit, Inject} from '@angular/core';
import { IModalDialog, IModalDialogOptions, IModalDialogButton } from 'ngx-modal-dialog';
import {Globals} from '../globals';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Subject } from 'rxjs';
import { NodeInfoService } from './node-info.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';



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
  dtTrigger: Subject<any> = new Subject();

  dataSource:any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[];
  columnsToDisplay: string[];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering

  constructor(private el: ElementRef, public globals: Globals,
              private service: NodeInfoService,
              public dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: Array<any>) {   }


  ngOnInit() {
    console.log("--------------");
    console.log(this.data);
    console.log("--------------");
    this.info = this.data;
    this.dataSource = new MatTableDataSource(this.data['outputs']);
    console.log(this.data['outputs']);
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

    this.service.saveNode (this.info.project, this.info.node_seq, this.info.output, this.info.comments).subscribe(
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

  onNoClick(): void {
    alert("Eeeeee");
    this.dialogRef.close();
  }

}
