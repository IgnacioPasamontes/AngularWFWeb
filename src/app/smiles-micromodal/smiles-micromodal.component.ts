import { Component,  Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-smiles-micromodal',
  templateUrl: './smiles-micromodal.component.html',
  styleUrls: ['./smiles-micromodal.component.css']
})
export class SmilesMicromodalComponent implements OnInit {
  @Input() id: string;
  constructor() { }

  ngOnInit() {
  }

}
