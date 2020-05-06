import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TIMEOUT_HEADER } from '../http-interceptors/timeout-interceptor';
declare let escapeHtmlString: any;

@Injectable({
  providedIn: 'root'
})
export class Name2casService {

  constructor(private http: HttpClient) { }

  cactus_webservice_URL = 'https://cactus.nci.nih.gov/chemical/structure/';


  getFromName(search_string: string, search_output: string, search_type: any = null, timeout: number = 60000): Observable<any> {
    const resolvers = {
      compound_name: 'name_by_opsin,name_by_cir',
      cas_number: 'cas_number',
      SMILES: 'smiles'
    };
    if (typeof search_type === 'string' || search_type instanceof String) {
      search_type = [search_type];
    }

    let params: HttpParams;
    const url: string = this.cactus_webservice_URL + encodeURIComponent(search_string) + '/' + search_output + '/xml';
    if (search_type !== null) {
      const resolvers_string: string = search_type.map(stype => resolvers[stype]).join(',');
      params = new HttpParams().append('resolver', resolvers_string);
    } else {
      params = new HttpParams();
    }
    const headers_obj: any = {};
    headers_obj[TIMEOUT_HEADER] = String(timeout);
    const headers = new HttpHeaders(headers_obj);
    return this.http.get(url, {responseType: 'text', params: params, headers: headers});
  }

  cactusXMLparsed(parseString_result: any, include_input_type: boolean = false) {
    let item_list = [];
    let counter = 0;
    if (parseString_result.request.hasOwnProperty('data')) {
      parseString_result.request.data.forEach(dat => {

        let resolver = dat.$.resolver;
        let string_class = dat.$.string_class; // type of input string detected
        if (dat.hasOwnProperty('item')) {
          dat.item.forEach(it => {

            let item = {
              int_id: counter,
              resolver: resolver,
              string_class: string_class,
              value: it._,
              classification: it.$.classification
            };
            let input_type_string = '';
            if (include_input_type) {
              input_type_string = 'input_type="' + item.string_class + '", ';
            }
            item['string_rep'] = item.value;
            item['html_rep'] = '<b>' + escapeHtmlString(item.value) + '</b>';
            if (typeof item.resolver === 'undefined' && typeof item.resolver === 'undefined') {
              item['string_rep'] = item.value;
              item['html_rep'] = '<b>' + item.value + '</b>';
            } else if (typeof item.resolver === 'undefined') {
              item['string_rep'] += ', ' + input_type_string + 'source="NA":"' + item.classification + '"';
              item['html_rep'] += ', ' + escapeHtmlString(input_type_string) + 'source="NA":"' +
               escapeHtmlString(item.classification) + '"';
            } else if (typeof item.classification === 'undefined') {
              item['string_rep'] += ', ' + input_type_string + 'source="' + item.resolver + '":"NA"';
              item['html_rep'] += ', ' + escapeHtmlString(input_type_string) + 'source="' + escapeHtmlString(item.resolver) + '":"NA"';
            } else {
              item['string_rep'] += ', ' + input_type_string + 'source="' + item.resolver + '":"' + item.classification + '"';
              item['html_rep'] += ', ' + escapeHtmlString(input_type_string) + 'source="' + escapeHtmlString(item.resolver) +
               '":"' + escapeHtmlString(item.classification) + '"';
            }

            item_list.push(item);
            counter++;
          });
        }

      });
    }
    return item_list;
  }

}
