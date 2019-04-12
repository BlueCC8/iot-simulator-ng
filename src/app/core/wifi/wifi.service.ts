import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { WifiModel } from './wifi.model';
import { NGXLogger } from 'ngx-logger';

const BACKEND_URL = environment.apiUrl + '/wifi/';
@Injectable({ providedIn: 'root' })
export class WifisService {
  private componentName = WifisService.name + ' ';
  private wifiLayers: WifiModel[] = [];

  //   private appLayerIdUpdated = new Subject<{ appLayer: AppLayerModel }>();
  constructor(private http: HttpClient, private router: Router, private logger: NGXLogger) {}

  updateWifi(wifi: WifiModel) {
    this.http.put(BACKEND_URL + wifi.id, wifi).subscribe(
      res => {
        // this.router.navigate(['/']);
      },
      error => {
        this.logger.error(this.componentName + error);
      }
    );
  }

  addWifi(wifi: WifiModel) {
    return this.http.post<string>(BACKEND_URL, wifi).pipe(
      map(wifiId => {
        return wifiId;
      })
    );
  }
}
