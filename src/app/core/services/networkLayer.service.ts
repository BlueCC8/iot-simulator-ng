import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NetLayerModel } from '../models/networkLayer.model';
import { NGXLogger } from 'ngx-logger';
import { NetLayerDto } from '../dtos/networkLayer.dto';

const BACKEND_URL = environment.apiUrl + '/net_layer/';
@Injectable({ providedIn: 'root' })
export class NetLayersService {
  private componentName = NetLayersService.name + ' ';
  private netLayers: NetLayerModel[] = [];

  private netLayersUpdated$ = new Subject<{ netLayers: NetLayerModel[]; maxNetLayers: number }>();

  constructor(private http: HttpClient, private router: Router, private logger: NGXLogger) {}

  // * Listener to be able to provide subscription to othe components
  getNetLayersUpdateListener() {
    return this.netLayersUpdated$.asObservable();
  }
  getNetLayers(pageSize: number, page: number) {
    let queryParams = '';
    if (pageSize && page) {
      queryParams = `?pagesize=${pageSize}&page=${page}`;
    }
    // this.logger.log(this.componentName + 'query params', queryParams);
    this.http
      .get<{ netLayers: NetLayerDto[]; maxNetLayers: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(netLayersData => {
          return {
            netLayers: netLayersData.netLayers.map(netLayer => {
              return {
                id: netLayer._id,
                nlName: netLayer.nlName,
                nlIPv4: netLayer.nlIPv4,
                nlIPv6: netLayer.nlIPv6,
                nlZig_LoWpan: netLayer.nlZig_LoWpan
              };
            }),
            maxNetLayers: netLayersData.maxNetLayers
          };
        })
      )
      .subscribe(
        transformedNetLayersData => {
          this.netLayers = transformedNetLayersData.netLayers;
          this.logger.log(this.componentName, this.netLayers);
          this.netLayersUpdated$.next({
            netLayers: [...this.netLayers],
            maxNetLayers: transformedNetLayersData.maxNetLayers
          });
        },
        error => {
          this.logger.error(this.componentName + error);
        }
      );
  }
  updateNetLayer(netLayer: NetLayerModel) {
    this.http.put(BACKEND_URL + netLayer.id, netLayer).subscribe(
      res => {
        // this.router.navigate(['/']);
      },
      error => {
        this.logger.error(this.componentName + error);
      }
    );
  }

  addNetLayer(netLayer: NetLayerModel) {
    return this.http.post<string>(BACKEND_URL, netLayer).pipe(
      map(netLayerId => {
        return netLayerId;
      })
    );
  }
}
