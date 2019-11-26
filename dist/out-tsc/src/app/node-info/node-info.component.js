import * as tslib_1 from "tslib";
import { Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { Globals } from '../globals';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { NodeInfoService } from './node-info.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Node1ProblemFormulationComponent } from '../node1-problem-formulation/node1-problem-formulation.component';
let NodeInfoComponent = class NodeInfoComponent {
    // We use this trigger because fetching the list of persons can be quite long,
    // thus we ensure the data is fetched before rendering
    constructor(el, globals, service, dialogRef, data) {
        this.el = el;
        this.globals = globals;
        this.service = service;
        this.dialogRef = dialogRef;
        this.data = data;
        this.inline_comments = false;
        this.savecomment = false;
        this.savecontent = false;
        this.inline_output = false;
        this.show_inline = false;
        this.dtOptions = {};
        this.Editor = ClassicEditor;
        this.dtTrigger = new Subject();
    }
    ngOnInit() {
        this.info = this.data;
        if (this.info.inputs_comments == undefined) {
            this.info.inputs_comments = '';
        }
        ;
        if (this.info.outputs_comments == undefined) {
            this.info.outputs_comments = '';
        }
        ;
        this.dataSource = new MatTableDataSource(this.data['outputs']);
        this.displayedColumns = Object.keys(this.data['outputs'][0]);
        this.columnsToDisplay = this.displayedColumns.slice();
        this.dataSource.paginator = this.paginator;
    }
    ngAfterViewInit() {
        // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        // Add 'implements AfterViewInit' to the class.
        this.savecomment = true;
        this.savecontent = true;
    }
    NodeCompleted(project_id, node_id) {
        this.service.saveNode(this.info.project, this.info.node_seq, this.info.outputs, this.info.outputs_comments, this.globals.node_csrf_token[project_id][node_id]).subscribe(result => {
            this.globals.change = !this.globals.change;
        });
        switch (node_id) {
            case 1: {
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
    onNoClick() {
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
};
tslib_1.__decorate([
    ViewChild(MatPaginator, { static: true }),
    tslib_1.__metadata("design:type", MatPaginator)
], NodeInfoComponent.prototype, "paginator", void 0);
tslib_1.__decorate([
    ViewChild(Node1ProblemFormulationComponent, { static: false }),
    tslib_1.__metadata("design:type", Object)
], NodeInfoComponent.prototype, "node1", void 0);
NodeInfoComponent = tslib_1.__decorate([
    Component({
        selector: 'app-node-info',
        templateUrl: './node-info.component.html',
        styleUrls: ['./node-info.component.css']
    }),
    tslib_1.__param(4, Inject(MAT_DIALOG_DATA)),
    tslib_1.__metadata("design:paramtypes", [ElementRef, Globals,
        NodeInfoService,
        MatDialogRef,
        Array])
], NodeInfoComponent);
export { NodeInfoComponent };
//# sourceMappingURL=node-info.component.js.map