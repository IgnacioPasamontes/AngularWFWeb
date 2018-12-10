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
import { NodeComponent } from './node/node.component';
import { NgDragDropModule } from 'ng-drag-drop';
import { CytoscapeModule } from 'ngx-cytoscape';
import { KeysPipe } from './keys.pipe';
import { DataTablesModule } from 'angular-datatables';

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
    NodeComponent,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgDragDropModule.forRoot(),
    CytoscapeModule,
    DataTablesModule
  ],
  providers: [ Globals ],
  bootstrap: [AppComponent]
})
export class AppModule { }
