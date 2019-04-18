import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AppLayerModel } from './applicationLayer.model';
import { NGXLogger } from 'ngx-logger';
import { AppLayerDto } from './applicationLayer.dto';

const BACKEND_URL = environment.apiUrl + '/app_layer/';
@Injectable({ providedIn: 'root' })
export class AppLayersService {
  private appLayers: AppLayerModel[] = [];
  private componentName = AppLayersService.name + ' ';
  private appLayersUpdated = new Subject<{ appLayers: AppLayerModel[]; maxAppLayers: number }>();

  constructor(private http: HttpClient, private router: Router, private logger: NGXLogger) {}

  // * Listener to be able to provide subscription to othe components
  getAppLayersUpdateListener() {
    return this.appLayersUpdated.asObservable();
  }
  getAppLayers(pageSize: number, page: number) {
    let queryParams = '';
    if (pageSize && page) {
      queryParams = `?pagesize=${pageSize}&page=${page}`;
    }
    // this.logger.log(this.componentName + 'query params', queryParams);
    this.http
      .get<{ appLayers: AppLayerDto[]; maxAppLayers: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(appLayersData => {
          return {
            appLayers: appLayersData.appLayers.map(device => {
              return {
                id: device._id,
                alName: device.alName,
                alHTTP: device.alHTTP,
                alCoAp: device.alCoAp,
                alWebSocket: device.alWebSocket,
                alMQTTE: device.alMQTTE,
                alDDS: device.alDDS,
                alAMQP: device.alAMQP
              };
            }),
            maxAppLayers: appLayersData.maxAppLayers
          };
        })
      )
      .subscribe(
        transformedAppLayersData => {
          this.appLayers = transformedAppLayersData.appLayers;
          this.logger.log(this.componentName, this.appLayers);
          this.appLayersUpdated.next({
            appLayers: [...this.appLayers],
            maxAppLayers: transformedAppLayersData.maxAppLayers
          });
        },
        error => {
          this.logger.error(this.componentName + error);
        }
      );
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
