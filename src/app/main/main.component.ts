import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public globals: Globals) { }

  ngOnInit() {
    this.globals.actual_user = this.globals.users['this.user_mail'];
    this.globals.actual_user = this.globals.users['ignacio.pasamontes@gmail.com'];

    document.getElementById('sidebarCollapse').addEventListener('click', function () {
      document.getElementById('sidebar').classList.toggle('active');
    });
    document.getElementById('[rel=\'tooltip\']');
  }

}
