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

export class ChEMBLCompound {
  constructor(compound: Compound, chembl_id?: string) {
    if (typeof compound !== 'undefined') {
      this['compound'] = compound;

    }
    if (typeof chembl_id !== 'undefined') {
      this['chembl_id'] = chembl_id;
    }
  }
  public compound: Compound;
  public chembl_id: string;
}


export class ChemblRaxService {

  public MAX_URL_LENGTH = 2000;
  public GET_DEFAULT_LIMIT = 1000;
  public POST_DEFAULT_LIMIT = 20;
  public CACHE_MAX_AGE = 86400;
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

  chEMBLSearchSubstructure(smiles: string, limit: number = null, url_get_check: boolean = false ) {
    const base_url: string = 'https://www.ebi.ac.uk/chembl/api/data/substructure/';
    let url: string = base_url + encodeURIComponent(smiles);
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
      formData.append('smiles', smiles);
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

  chemblSmilesStandarize(smiles: string, parent: boolean = false, isomeric: boolean = true): Observable<any> {
    const url: string = environment.baseUrl + 'chembl/standarize_smiles/';
    const params = new HttpParams().append('parent', this.encodeBoolean(parent)).append('isomeric', this.encodeBoolean(isomeric));
    const formData = new FormData();
    formData.append('smiles', smiles);
    return this.http.post(url, formData, {params: params, withCredentials: true});
  }

  chEMBLGetMoleculeDataNext(next: string, limit: number = null) {
    const base_url: string = 'https://www.ebi.ac.uk';
    let url: string = base_url + next;
    let urlp = new UrlParse(url, {}, true);
    let urlp2 = new UrlParse(url, {}, true);
    let encoded_smiles = urlp.query['smiles'];
    let orig_str_limit = urlp.query['limit'];
    urlp2.set('query', {limit: orig_str_limit});
    urlp2.set('pathname', urlp.pathname + '/' + encoded_smiles);
    if (url.length > this.MAX_URL_LENGTH) {
      const formData = new FormData();
      Object.keys(urlp.query).forEach(key => {
        formData.append(key, urlp.query[key]);
      });
      if (urlp2.href.length <= this.MAX_URL_LENGTH) {
        formData.set('limit', this.POST_DEFAULT_LIMIT.toString());
      }
      if (limit !== null) {
        formData.set('limit', limit.toString());
      }
      return this.http.post(base_url + urlp.pathname , formData, {withCredentials: false,
        headers: new HttpHeaders({'X-HTTP-Method-Override': 'GET'})});
    } else {
      if (limit !== null) {
        let urlp3 = new UrlParse(url, {}, true);
        urlp.query['limit'] = limit.toString();
        urlp3.set('query', urlp.query);
        url = urlp3.href;
      }
      return this.http.get(url, {withCredentials: false,
        headers: new HttpHeaders({})});
    }
  }

  setFingerPrintSimilarityFromSmiles(smiles: string): Observable<any> {
    const url: string = environment.baseUrl + 'rdkit/similarity/set/';
    const formData = new FormData();
    formData.append('smiles', smiles);
    return this.http.post(url, formData, {withCredentials: true});
  }

  similarityFromSmiles(smiles: string[], cutoff: number): Observable<any> {
    const url: string = environment.baseUrl + 'rdkit/similarity/' + cutoff.toString() + '/';
    const formData = new FormData();
    const smiles_array: Object[] = [];
    smiles.forEach(smi => {
      smiles_array.push({smiles: smi});
    });
    return this.http.post(url, JSON.stringify(smiles_array), {withCredentials: true,
       headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }
}
