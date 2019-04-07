import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AppLayerModel } from './applicationLayer.model';

const BACKEND_URL = environment.apiUrl + '/app_layer/';
@Injectable({ providedIn: 'root' })
export class AppLayersService {
  private appLayers: AppLayerModel[] = [];

  private appLayersUpdated = new Subject<{ appLayers: AppLayerModel[] }>();
  //   private appLayerIdUpdated = new Subject<{ appLayer: AppLayerModel }>();
  constructor(private http: HttpClient, private router: Router) {}

  // * Listener to be able to provide subscription to othe components
  getAppLayersUpdateListener() {
    return this.appLayersUpdated.asObservable();
  }

  updateAppLayer(appLayer: AppLayerModel) {
    this.http.put(BACKEND_URL + appLayer.id, appLayer).subscribe(res => {
      // this.router.navigate(['/']);
    });
  }

  addAppLayer(appLayer: AppLayerModel) {
    return this.http.post<string>(BACKEND_URL, appLayer).pipe(
      map(appLayerId => {
        return appLayerId;
      })
    );
  }
}
