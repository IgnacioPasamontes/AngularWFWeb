import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';



const routes: Routes = [

  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent},
  { path: 'main', component: MainComponent}
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
