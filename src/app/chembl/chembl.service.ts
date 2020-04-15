import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { User } from '../user';
@Injectable({
  providedIn: 'root'
})
export class ChemblService {

  constructor(private http: HttpClient,
    private cookieService: CookieService,
    public globals: Globals) { }

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

  arrayToItemList(array: Array<any>) {
    let item_list: Array<Object> = [];
    let i = 1;
    array.forEach(value => {
      item_list.push({int_id: i, value: value, html_rep: value, string_rep: value});
      i++;
    });
    return item_list;
  }

}
