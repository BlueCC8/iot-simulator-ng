import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NetLayerModel } from './networkLayer.model';

const BACKEND_URL = environment.apiUrl + '/net_layer/';
@Injectable({ providedIn: 'root' })
export class NetLayersService {
  private netLayers: NetLayerModel[] = [];

  private netLayersUpdated = new Subject<{ netLayers: NetLayerModel[] }>();
  //   private appLayerIdUpdated = new Subject<{ appLayer: AppLayerModel }>();
  constructor(private http: HttpClient, private router: Router) {}

  // * Listener to be able to provide subscription to othe components
  getNetLayersUpdateListener() {
    return this.netLayersUpdated.asObservable();
  }

  updateNetLayer(netLayer: NetLayerModel) {
    this.http.put(BACKEND_URL + netLayer.id, netLayer).subscribe(res => {
      // this.router.navigate(['/']);
    });
  }

  addNetLayer(netLayer: NetLayerModel) {
    return this.http.post<string>(BACKEND_URL, netLayer).pipe(
      map(netLayerId => {
        return netLayerId;
      })
    );
  }
}
