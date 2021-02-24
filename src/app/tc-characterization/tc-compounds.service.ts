import { Injectable } from '@angular/core';
import { Compound, CompoundService } from '../compound/compound.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TcCompoundsService {

  constructor(private compound_service: CompoundService) { }
  compounds$: BehaviorSubject<Compound[]> = new BehaviorSubject<Compound[]>(undefined);

  getCompounds(project_id: number) {
    this.compound_service.getCompounds(project_id,
      Compound.TARGET_COMPOUND, this.compounds$);
  }
}
