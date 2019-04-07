import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LinkLayerModel } from './linkLayer.model';

const BACKEND_URL = environment.apiUrl + '/link_layer/';
@Injectable({ providedIn: 'root' })
export class LinkLayersService {
  //   private appLayerIdUpdated = new Subject<{ appLayer: AppLayerModel }>();
  constructor(private http: HttpClient, private router: Router) {}

  updateLinLayer(linLayer: LinkLayerModel) {
    this.http.put(BACKEND_URL + linLayer.id, linLayer).subscribe(res => {
      // this.router.navigate(['/']);
    });
  }

  addLinLayer(linLayer: LinkLayerModel) {
    return this.http.post<string>(BACKEND_URL, linLayer).pipe(
      map(linLayerId => {
        return linLayerId;
      })
    );
  }
}
