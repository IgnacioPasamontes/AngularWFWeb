import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tc-characterization',
  templateUrl: './tc-characterization.component.html',
  styleUrls: ['./tc-characterization.component.css']
})
export class TcCharacterizationComponent implements OnInit {

  @Input() info;

  ngOnInit() {}
}
