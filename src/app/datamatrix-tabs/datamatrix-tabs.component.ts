import { Component, OnInit } from '@angular/core';
import { DatamatrixTabsService } from './datamatrix-tabs.service';

@Component({
  selector: 'app-datamatrix-tabs',
  templateUrl: './datamatrix-tabs.component.html',
  styleUrls: ['./datamatrix-tabs.component.css']
})
export class DatamatrixTabsComponent implements OnInit {



  constructor(public service: DatamatrixTabsService) { }

  ngOnInit() {
  }

  showTab(tab_index: number) {
    this.service.setActiveTab(tab_index);
    this.service.active_tab_index = tab_index;
  }

}
