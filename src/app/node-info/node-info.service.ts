import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NodeInfoService {

  constructor(private http: HttpClient) { }

  saveNode(project: number, node: number, output: string, comments: string): Observable<any> {

    const formData = new FormData();
    formData.append('output', output);
    formData.append('output_comments', comments);
    // formData.append('parameters',  this.model.parameters);
    const url: string = environment.baseUrl  + 'project/' + project + '/node/' + node;
    return this.http.post(url, formData);

  }
}
