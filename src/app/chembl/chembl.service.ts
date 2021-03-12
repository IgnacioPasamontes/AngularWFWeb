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
import * as UrlParse from 'url-parse';
import { TIMEOUT_HEADER } from '../http-interceptors/timeout-interceptor';
@Injectable({
  providedIn: 'root'
})
export class ChemblService {
  public MAX_URL_LENGTH = 2000;
  public GET_DEFAULT_LIMIT = 1000;
  public POST_DEFAULT_LIMIT = 20;
  public CACHE_MAX_AGE = 86400;
  public chembl_activity_fields: Array<string> = ['standard_type', 'standard_value', 'standard_units',
  'assay_description', 'value', 'units', 'assay_chembl_id', 'text_value', 'activity_comment', 'pchembl_value'];
  public chembl_displayed_activity_fields = ['standard_type', 'standard_value', 'standard_units',
  'assay_description'];
  public chembl_calculated_pc_dict = {
    'mw_freebase':                   {'standard_type': "MW",                            'assay_description': "Molecular Weight", 'standard_units':"g/mol", 'units':"g/mol"},                                                                            
    'rtb':                           {'standard_type': "#Rot. Bonds",                   'assay_description': "Number of Rotatable Bonds", 'standard_units': null, 'units': null},                                                        
    'alogp':                         {'standard_type': "ALogP",                         'assay_description': "ALogP", 'standard_units': null, 'units': null},                                                                                     
    'psa':                           {'standard_type': "PSA",                           'assay_description': "Polar Surface Area", 'standard_units':"Å2", 'units':"Å2"},                                                                       
    'molecular_species':             {'standard_type': "Mol. Species",                  'assay_description': "Molecular Species", 'standard_units': null, 'units': null, 'data_type': 'text'},                                                                         
    'hba':                           {'standard_type': "HBA",                           'assay_description': "Hydrogen Bond Acceptors (number)", 'standard_units': null, 'units': null},                                                            
    'hbd':                           {'standard_type': "HBD",                           'assay_description': "Hydrogen Bond Donors (number)", 'standard_units': null, 'units': null},                                                              
    'num_ro5_violations':            {'standard_type': "#Ro5 Violations",               'assay_description': "number of Rule of 5 Violations", 'standard_units': null, 'units': null},                                                            
    'hba_lipinski':                  {'standard_type': "HBA (Lipinski)",                'assay_description': "Lipinski's Hydrogen Bond Acceptors (number)", 'standard_units': null, 'units': null},                                             
    'hbd_lipinski':                  {'standard_type': "HBD (Lipinski)",                'assay_description': "Lipinski's Hydrogen Bond Donors (number)" , 'standard_units': null, 'units': null},                                                 
    'num_lipinski_ro5_violations':   {'standard_type': "#Ro5 Violations (Lipinski)",    'assay_description': "Number of Lipinski's Rule of 5 Violations", 'standard_units': null, 'units': null},                                       
    'cx_most_apka':                  {'standard_type': "CX Acidic pKa",                 'assay_description': "The most Acidic ACDlabs v12.01 calculated CX pKa", 'standard_units': null, 'units': null},                                         
    'cx_most_bpka':                  {'standard_type': "CX Basic pKa",                  'assay_description': "The most Basic ACDlabs v12.01 calculated CX pKa", 'standard_units': null, 'units': null},                                             
    'cx_logp':                       {'standard_type': "CX LogP",                       'assay_description': "ACDlabs v12.01 calculated CX LogP", 'standard_units': null, 'units': null},                                                     
    'cx_logd':                       {'standard_type': "CX LogD pH7.4",                 'assay_description': "ACDlabs v12.01 calculated CX LogD pH7.4", 'standard_units': null, 'units': null},                                                   
    'aromatic_rings':                {'standard_type': "Aromatic Rings",                'assay_description': "Aromatic Rings (number)", 'standard_units': null, 'units': null},                                                                  
    'heavy_atoms':                   {'standard_type': "Heavy Atoms",                   'assay_description': "Heavy Atoms (number)", 'standard_units': null, 'units': null},                                                                     
    'qed_weighted':                  {'standard_type': "QED Weighted",                  'assay_description': "Quantitative Estimate of Druglikeness (Weighted)", 'standard_units': null, 'units': null},                                       
    'ro3_pass':                      {'standard_type': "Ro3 Pass",                      'assay_description': "Indicates whether the compound passes the rule-of-three of Fragment-based lead discovery", 'standard_units': null, 'units': null}   
    
  };
  public chembl_ro3_pass_dict = {'N':0,'Y':1};
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

  chemblSmilesStandarize(smiles: string, parent: boolean = false, isomeric: boolean = true): Observable<any> {
    const url: string = environment.baseUrl + 'chembl/standarize_smiles/';
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

  getChEMBLCalculatedPCFromMoleculeData(data: Object) {
    let data2: Object;
    if (data.hasOwnProperty('molecule')) {
      data2 = data['molecule'];
    } else {
      data2 = data;
    }
    const pcs = data2['molecule_properties'];
    let new_data: Array<Object> = [];
    const pc_dict = this.chembl_calculated_pc_dict;

    Object.keys(this.chembl_calculated_pc_dict).forEach(pc => {
      

      if (pcs[pc] === null || typeof pcs[pc] === 'undefined') {
          return;
      }
      let activity: Object = {
        'standard_type': pc_dict[pc]['standard_type'],
        'standard_value': pcs[pc],
        'value': pcs[pc],
        'standard_units': pc_dict[pc]['standard_units'],
        'units': pc_dict[pc]['standard_units'],
        'assay_description': pc_dict[pc]['assay_description'],
        'assay_chembl_id': pc,
        'assay_type': 'calculated_pc',
        'activity_comment': null,
        'text_value': null,
      };



      if (pc_dict[pc]['data_type'] === 'text') {
        activity['value'] = null;
        activity['standard_value'] = null;
        activity['text_value'] = pcs[pc];
      }
      if (pc === 'ro3_pass') {
          activity['value'] = this.chembl_ro3_pass_dict[pcs[pc]];
          activity['standard_value'] = this.chembl_ro3_pass_dict[pcs[pc]];
      }
      new_data.push(activity);
    });

    return new_data;
  }

  chEMBLGetActivityPCDataByCompoundId(chemblid: string, assay_type: string = 'A') {
    let url: string = 'https://www.ebi.ac.uk/chembl/api/data/activity';
    const params = new HttpParams().append('format', 'json').append('assay_type', assay_type).
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

  saveChemblData(compound: Compound, data: Array<Object>, chembl_ids: string[]): Observable<any> {
    console.log('chembl_ids:');
    console.log(chembl_ids);
    let new_data: Object;
    if (chembl_ids.length === 1) {
      new_data = {'chembl_id':chembl_ids[0],'data': data}
    } else {
      new_data = data;
    }
     
    const url: string = environment.baseUrl + 'project/' + compound.project.toString() + '/compound/' + 
    Compound.ra_type_abbrev_to_value_dict[compound.ra_type] + '/' + compound.int_id.toString() + '/chembl_save/';
    let options: Object = this.loginService.getPOSTHttpOptions();
    options['headers'] = options['headers'].append('Content-Type', 'application/json');
    return this.http.post(url, JSON.stringify(new_data), options);
  }

  saveChemblDataMultiple(project: number, ra_type: number, compounds: Compound[], data_list: Array<Object[]>): Observable<any> {
    const url: string = environment.baseUrl + 'project/' + project.toString() + '/compound/' + 
    Compound.ra_type_abbrev_to_value_dict[ra_type] + '/multiple/chembl_save/';
    let options: Object = this.loginService.getPOSTHttpOptions();
    options['headers'] = options['headers'].append('Content-Type', 'application/json');
    options['headers'] = options['headers'].append('ng_timeout', '0');
    const data_json: Object[] = [];
    for (let i = 0; i < compounds.length; i++) {
      if (compounds[i] === null || typeof compounds[i] === 'undefined' || data_list[i] === null
       ||typeof data_list[i]  === 'undefined') {
         continue;
       }
      data_json.push({int_id:compounds[i].int_id,data: data_list[i]});
    }
    return this.http.post(url, JSON.stringify(data_json), options);
  }


  chEMBLSmilesSearch(smiles: string, limit: number = null, url_get_check: boolean = false ) {
    const base_url: string = 'https://www.ebi.ac.uk/chembl/api/data/molecule.json';

    let url: string = base_url +'?molecule_structures__canonical_smiles__flexmatch='+ encodeURIComponent(smiles);
    let urlp = new UrlParse(url, {}, true);

    let tmp_limit: number = limit;
    if (limit === null) {
      tmp_limit = this.GET_DEFAULT_LIMIT;
    }
    urlp.set('query', {limit: tmp_limit});
    if (urlp.href.length > this.MAX_URL_LENGTH) {
      if (url_get_check) {
        return false;
      }
      if (limit === null) {
        limit = this.POST_DEFAULT_LIMIT;
      }
      url = base_url;
      const formData = new FormData();
      formData.append('molecule_structures__canonical_smiles__flexmatch', smiles);
      formData.append('limit', limit.toString());
      return this.http.post(url, formData, {withCredentials: false, headers: new HttpHeaders(
        {'X-HTTP-Method-Override': 'GET'})});
    } else {
      if (url_get_check) {
        return true;
      }
      if (limit === null) {
        limit = this.GET_DEFAULT_LIMIT;
      }
      const params = new HttpParams().append('limit', limit.toString());
      return this.http.get(url, {params: params, withCredentials: false,
        headers: new HttpHeaders({})});
    }

  }

  chEMBLSmilesGetDataNext(next: string) {
    let url: string = 'https://www.ebi.ac.uk' + next;
    return this.http.get(url);
  }
}
