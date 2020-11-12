import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { User } from '../user';
import { LoginService } from '../login/login.service';
import { Compound, CompoundService } from '../compound/compound.service';

import { TIMEOUT_HEADER } from '../http-interceptors/timeout-interceptor';
@Injectable({
  providedIn: 'root'
})
export class ChemblService {

  public chembl_activity_fields: Array<string> = ['standard_type', 'standard_value', 'standard_units',
  'assay_description', 'value', 'units', 'assay_chembl_id', 'text_value', 'activity_comment', 'pchembl_value'];
  public chembl_displayed_activity_fields = ['standard_type', 'standard_value', 'standard_units',
  'assay_description'];
  constructor(private http: HttpClient,
    private cookieService: CookieService,
    public globals: Globals,
    private loginService: LoginService) { }

  encodeBoolean(bool: boolean) {
    if (bool) {
      return '1';
    } else {
      return '0';
    }
  }

  chemblSmilesToInChIKey(smiles: string, parent: boolean = false, isomeric: boolean = true): Observable<any> {
    const url: string = environment.baseUrl + 'chembl/smiles2inchikey/';
    const params = new HttpParams().append('parent', this.encodeBoolean(parent)).append('isomeric', this.encodeBoolean(isomeric));
    const formData = new FormData();
    formData.append('smiles', smiles);
    return this.http.post(url, formData, {params: params, withCredentials: true});
  }

  uniChemGetSrcIdFromInChIKey(inchikey: string) {
    const callback_get_param = 'callback';
    const callback_get_param_value = 'get_src_ids';
    let url: string = 'https://www.ebi.ac.uk/unichem/rest/inchikey/' + inchikey;
    // const params = new HttpParams().append(callback_get_param, callback_get_param_value);
    return this.http.jsonp(url, callback_get_param);
  }

  getChEMBLIDFromUniChemData(data: Array<object>) {
    const src_id_key = 'src_id';
    const src_compound_id_key = 'src_compound_id';
    const chembl_src_id = 1;
    let chembl_ids: Array<string> = [];
    data.forEach(element => {
      if (Number(element[src_id_key]) === chembl_src_id) {
        chembl_ids.push(element[src_compound_id_key]);
      }
    });
    return chembl_ids;
  }

  chEMBLGetMoleculeFromCompoundId(chemblid: string) {
    let url: string = 'https://www.ebi.ac.uk/chembl/api/data/molecule/' + chemblid + '/';
    const params = new HttpParams().append('format', 'json');
    return this.http.get(url);
  }

  getChEMBLSMILESFromMoleculeData(data: Object) {
    let data2: Object;
    if (data.hasOwnProperty('molecule')) {
      data2 = data['molecule'];
    } else {
      data2 = data;
    }
    return data2['molecule_structures']['canonical_smiles'];
  }

  chEMBLGetADMETActivityDataByCompoundId(chemblid: string) {
    let url: string = 'https://www.ebi.ac.uk/chembl/api/data/activity';
    const params = new HttpParams().append('format', 'json').append('assay_type', 'A').
      append('molecule_chembl_id', chemblid);
    return this.http.get(url, {params: params});
  }

  chEMBLGetADMETActivityDataNext(next: string) {
    let url: string = 'https://www.ebi.ac.uk' + next;
    return this.http.get(url);
  }

  arrayToItemList(array: Array<any>) {
    let item_list: Array<Object> = [];
    let i = 1;
    array.forEach(value => {
      item_list.push({int_id: i, value: value, html_rep: value, string_rep: value});
      i++;
    });
    return item_list;
  }

  saveChemblData(compound: Compound, data: Array<Object>): Observable<any> {
    const url: string = environment.baseUrl + 'project/' + compound.project.toString() + '/compound/' + 
    Compound.ra_type_abbrev_to_value_dict[compound.ra_type] + '/' + compound.int_id.toString() + '/chembl_save/';
    let options: Object = this.loginService.getPOSTHttpOptions();
    options['headers'] = options['headers'].append('Content-Type', 'application/json');
    return this.http.post(url, JSON.stringify(data), options);
  }
}
