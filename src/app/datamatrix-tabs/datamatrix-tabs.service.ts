import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatamatrixTabsService {

  public tabs: Array<string> = ['Activities','TEST','PC'];
  public active_tab_index: number = 0;
  public active_tab_name: string;

  constructor() {this.active_tab_name = this.tabs[this.active_tab_index];}


  setActiveTab(tab_index: number) {
    this.active_tab_index = tab_index;
    this.active_tab_name = this.tabs[this.active_tab_index];

  }
}
