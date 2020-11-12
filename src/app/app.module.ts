import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgDragDropModule } from 'ng-drag-drop';
import { CytoscapeModule } from 'ngx-cytoscape';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DataTablesModule } from 'angular-datatables';
import { ModalDialogModule } from 'ngx-modal-dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ResizableModule } from 'angular-resizable-element';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule, OverlayContainer, FullscreenOverlayContainer } from '@angular/cdk/overlay';

import { Globals } from './globals';

import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TabsComponent } from './tabs/tabs.component';
import { WorkflowsComponent } from './workflows/workflows.component';
import { EachWorkflowComponent } from './each-workflow/each-workflow.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SmilesMicromodalComponent } from './smiles-micromodal/smiles-micromodal.component';
import { NodeInfoComponent } from './node-info/node-info.component';
import { EditableComponent } from './editable/editable.component';
import { Node1ProblemFormulationComponent } from './node1-problem-formulation/node1-problem-formulation.component';
import { TkWorkflowComponent } from './tk-workflow/tk-workflow.component';
import { TdWorkflowComponent } from './td-workflow/td-workflow.component';
import { TcCharacterizationComponent } from './tc-characterization/tc-characterization.component';
import { OverlayComponent } from './overlay/overlay.component';
import { Name2casComponent } from './name2cas/name2cas.component';
import { ChemblComponent } from './chembl/chembl.component';
import { CompoundComponent } from './compound/compound.component';
import { DatamatrixComponent } from './datamatrix/datamatrix.component';
import { ChemblRaxComponent } from './chembl-rax/chembl-rax.component';

import { KeysPipe } from './keys.pipe';
import { EscapeHtmlPipe } from './pipes/keep-html.pipe';

import { ViewModeDirective } from './editable/view-mode.directive';
import { EditModeDirective } from './editable/edit-mode.directive';
import { EditableOnEnterDirective } from './editable/edit-on-enter.directive';

import { httpInterceptorProviders } from './http-interceptors/index';
import { LoginService } from './login/login.service';
import { TabsService } from './tabs/tabs.service'
import { EachWorkflowService } from './each-workflow/each-workflow.service';
import { Node1ProblemFormulationService } from './node1-problem-formulation/node1-problem-formulation.service';
import { NodeInfoService } from './node-info/node-info.service';
import { CookieService } from 'ngx-cookie-service';
import { TcCharacterizationService } from './tc-characterization/tc-characterization.service';
import { Name2casService } from './name2cas/name2cas.service';
import { ChemblService } from './chembl/chembl.service';
import { CompoundService } from './compound/compound.service';
import { TcCompoundsService } from './tc-characterization/tc-compounds.service';
import { ChemblRaxService } from './chembl-rax/chembl-rax.service';
import { MoleculePickerComponent } from './molecule-picker/molecule-picker.component';
import { ReportComponent } from './report/report.component';








@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    NavbarComponent,
    SidebarComponent,
    TabsComponent,
    WorkflowsComponent,
    EachWorkflowComponent,
    NodeInfoComponent,
    EditableComponent,
    ViewModeDirective,
    EditModeDirective,
    EditableOnEnterDirective,
    KeysPipe,
    Node1ProblemFormulationComponent,
    WelcomeComponent,
    SmilesMicromodalComponent,
    TkWorkflowComponent,
    TdWorkflowComponent,
    TcCharacterizationComponent,
    OverlayComponent,
    Name2casComponent,
    ChemblComponent,
    CompoundComponent,
    DatamatrixComponent,
    EscapeHtmlPipe,
    ChemblRaxComponent,
    MoleculePickerComponent,
    ReportComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    AppRoutingModule,
    NgDragDropModule.forRoot(),
    CytoscapeModule,
    DataTablesModule,
    ModalDialogModule.forRoot(),
    BrowserAnimationsModule, // required animations module
    DragDropModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    CKEditorModule,
    NgbModalModule,
    NgbTooltipModule,
    OverlayModule,
    PortalModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }), // ToastrModule added
    ResizableModule
  ],
  providers: [
    httpInterceptorProviders,
    Globals,
    LoginService,
    CookieService,
    TabsService,
    EachWorkflowService,
    NodeInfoService,
    Node1ProblemFormulationService,
    TcCharacterizationService,
    Name2casService,
    ChemblService,
    CompoundService,
    TcCompoundsService,
    ChemblRaxService,
    {provide: OverlayContainer, useClass: FullscreenOverlayContainer}
  ],
  entryComponents: [NodeInfoComponent, OverlayComponent, MoleculePickerComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
