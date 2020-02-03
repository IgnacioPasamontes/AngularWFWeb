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
export class TcCharacteritzationService {

  constructor(private http: HttpClient) { }

  cactus_webservice_URL: string = 'https://cactus.nci.nih.gov/chemical/structure/';

  getCASFromName(compound_name: string): Observable<any> {
    const url: string = this.cactus_webservice_URL+encodeURIComponent(compound_name)+'/cas/xml';
    let params = new HttpParams().append('resolver','name_by_opsin,name_by_cir');
    return this.http.get(url,{responseType: 'text', params: params});
  }

  cactusXMLparsed(parseString_result: any, include_input_type: boolean = false) {
    let cas_list = [];
    let counter: number = 0;
    if (parseString_result.request.hasOwnProperty('data')) {
      parseString_result.request.data.forEach(dat => {
        
        let resolver = dat.$.resolver;
        let string_class = dat.$.string_class; //type of input string detected
        if (dat.hasOwnProperty('item')) {
          dat.item.forEach(it =>{

            let cas = {
              int_id: counter,
              resolver: resolver,
              string_class: string_class,
              rgn: it._,
              classification: it.$.classification
            };
            let input_type_string : string = '';
            if (include_input_type) {
              let input_type_string = 'input_type="'+cas.string_class+'", ';
            }
            cas['string_rep'] = cas.rgn+', '+input_type_string+'source="'+cas.resolver+'":"'+cas.classification+'"';
            cas['html_rep'] = '<b>'+cas.rgn+'</b>, '+input_type_string+'source="'+cas.resolver+'":"'+cas.classification+'"';
    
            cas_list.push(cas);
            counter++;
          });
        }

      });
    }
    return cas_list;
  }

}
