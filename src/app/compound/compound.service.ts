import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { LoginService } from '../login/login.service';
import { AsyncSubject, BehaviorSubject } from 'rxjs';


export class Compound {

  constructor(compound_obj?: Object) {
    if (typeof compound_obj !== 'undefined') {
      Compound.data_fields.forEach(field => {
        if (compound_obj.hasOwnProperty(field)) {
          this[field] = compound_obj[field];
        }
      });
      if (!compound_obj.hasOwnProperty('chembl_id')) {
        this['chembl_id'] = null;
      }
    }
  }

  public static TARGET_COMPOUND: number = 0;
  public static SOURCE_COMPOUND: number = 1;
  public static ra_type_abbrev_to_value_dict: Object = {0: 'tc', 1: 'sc'};
  public static data_fields: Array<string> = ['smiles', 'cas_rn', 'name',
  'project', 'int_id', 'ra_type', 'chembl_id'];

  public smiles: string;
  public cas_rn: string[];
  public name: string;
  public project: number;
  public int_id: number;
  public ra_type: number;
  public chembl_id: string = null;

  static getObject( compound: Compound, undef = false) {
    const obj: Object = {};
    Compound.data_fields.forEach(field => {
      if ( typeof this[field] !== 'undefined' || undef ) {
        obj[field] = this[field];
      }
    });
    return obj;
  }


  getObject(undef = false) {
    const obj: Object = {};
    Compound.data_fields.forEach(field => {
      if ( typeof this[field] !== 'undefined' || undef ) {
        obj[field] = this[field];
      }
    });
    return obj;
  }

}

@Injectable({
  providedIn: 'root'
})
export class CompoundService {

  constructor(public globals: Globals,
              private http: HttpClient,
              private loginService: LoginService) { }



  getCompound(project: number, ra_type: number, int_id: number): AsyncSubject<Compound> {
    const compounds$ = new AsyncSubject<Compound>();
    const url: string = environment.baseUrl  + 'project/' + project + '/compound/' +
     Compound.ra_type_abbrev_to_value_dict[ra_type] + '/' + int_id.toString() + '/';
    const subs = this.http.get(url, {withCredentials: true}).subscribe(result => {
      compounds$.next(new Compound(result));
    },
    error => {
      compounds$.error(error);
      subs.unsubscribe();
    },
    () => {
      compounds$.complete();
      subs.unsubscribe();
    });
    return compounds$;
  }

  getCompounds(project: number, ra_type: number, compounds$: BehaviorSubject<Compound[]> = undefined ): BehaviorSubject<Compound[]> {
    if (typeof compounds$ === 'undefined') {
      compounds$ = new BehaviorSubject<Compound[]>(undefined);
    }
    const url: string = environment.baseUrl  + 'project/' + project + '/compound/' +
     Compound.ra_type_abbrev_to_value_dict[ra_type] + '/';
    const subs = this.http.get(url, {withCredentials: true}).subscribe(result => {
      const compounds: Array<Compound> = [];
      (<Object[]>result).forEach(compound => {
        compounds.push(new Compound(compound));
      });
      compounds$.next(compounds);
    },
    error => {
      compounds$.error(error);
      subs.unsubscribe();
    },
    () => {
      // compounds$.complete();
      subs.unsubscribe();
    });
    return compounds$;
  }

  saveCompound(compound: Compound, create_new = true): Observable<any> {
    let compound_obj = compound.getObject(false);
    if ( !create_new && !compound_obj.hasOwnProperty('int_id') ) {
      throw new Error('"int_id" property undefined when updating a compound.');
    }

    let url_suffix: string;
    if (create_new) {
      url_suffix = '';
    } else {
      url_suffix = compound.int_id.toString() + '/';
    }
/*     const formData = new FormData();
    Object.keys(compound_obj).forEach( field => {
      formData.append(field, compound_obj[field]);
    }); */

    if (typeof compound.getObject === 'function') {
      compound_obj = compound.getObject(false);
    } else if (typeof compound === 'object') {
      compound_obj = compound;
    } else {
      compound_obj = Compound.getObject(compound, false); 
    }
    const data = JSON.stringify(compound_obj);
    const options = this.loginService.getPOSTHttpOptions();
    options['headers'] = options['headers'].append('Content-Type', 'application/json');
    const url: string = environment.baseUrl  + 'project/' + compound.project + '/compound/' +
     Compound.ra_type_abbrev_to_value_dict[compound.ra_type] + '/' + url_suffix;
     if (create_new) {
      return this.http.post(url, data, options);
    } else {
      return this.http.put(url, data, options);
    }
  }

  saveCompounds(compounds: Compound[], ra_type: number, project: number, create_new = true): Observable<any> {
    let compound_objs: Object[] = [];
    let compound_obj: Object;

    compounds.forEach(compound => {

      if (typeof compound.getObject === 'function') {
        compound_obj = compound.getObject(false);
      } else if (typeof compound === 'object') {
        compound_obj = compound;
      } else {
        compound_obj = Compound.getObject(compound, false); 
      }
      compound_objs.push(compound_obj);
    });

    const data = JSON.stringify(compound_objs);
    const options = this.loginService.getPOSTHttpOptions();
    options['headers'] = options['headers'].append('Content-Type', 'application/json');
    const url: string = environment.baseUrl  + 'project/' + project + '/compound/' +
     Compound.ra_type_abbrev_to_value_dict[ra_type] + '/multiple/';
    if (create_new) {
      return this.http.post(url, data, options);
    } else {
      return this.http.put(url, data, options);
    }
  }

  deleteCompound(project: number, ra_type: number, int_id: number): Observable<any> {
    const url: string = environment.baseUrl  + 'project/' + project + '/compound/' +
     Compound.ra_type_abbrev_to_value_dict[ra_type] + '/' + int_id.toString() + '/';
    return this.http.delete(url, this.loginService.getPOSTHttpOptions());
  }
}
