import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    document.getElementById("sidebarCollapse").addEventListener('click', function () {
      document.getElementById("sidebar").classList.toggle('active');
    }); 
    document.getElementById("[rel='tooltip']");
  }

}
