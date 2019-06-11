import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './main/main.component';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TabsComponent } from './tabs/tabs.component';
import { WorkflowsComponent } from './workflows/workflows.component';
import { Globals } from './globals';
import { EachWorkflowComponent } from './each-workflow/each-workflow.component';
import { NodeInfoComponent } from './node-info/node-info.component';
import { NgDragDropModule } from 'ng-drag-drop';
import { CytoscapeModule } from 'ngx-cytoscape';
import { KeysPipe } from './keys.pipe';
import { DataTablesModule } from 'angular-datatables';
import { ModalDialogModule } from 'ngx-modal-dialog';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LoginService } from './login/login.service';
import { HttpClientModule } from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';

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
    KeysPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgDragDropModule.forRoot(),
    CytoscapeModule,
    DataTablesModule,
    ModalDialogModule.forRoot(),
    CKEditorModule,
    BrowserAnimationsModule, // required animations module
    DragDropModule,
    MatTableModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }) // ToastrModule added
  ],
  providers: [ Globals, LoginService ],
  entryComponents: [NodeInfoComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
