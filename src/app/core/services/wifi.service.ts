import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { WifiModel } from '../models/wifi.model';
import { NGXLogger } from 'ngx-logger';
import { WifiDto } from '../dtos/wifi.dto';

const BACKEND_URL = environment.apiUrl + '/wifi/';
@Injectable({ providedIn: 'root' })
export class WifisService {
  private componentName = WifisService.name + ' ';
  private wifis: WifiModel[] = [];
  private wifisUpdated$ = new Subject<{ wifis: WifiModel[]; maxWifis: number }>();

  constructor(private http: HttpClient, private router: Router, private logger: NGXLogger) {}

  // * Listener to be able to provide subscription to othe components
  getWifisUpdateListener() {
    return this.wifisUpdated$.asObservable();
  }
  getWifis(pageSize: number, page: number) {
    let queryParams = '';
    if (pageSize && page) {
      queryParams = `?pagesize=${pageSize}&page=${page}`;
    }
    // this.logger.log(this.componentName + 'query params', queryParams);
    this.http
      .get<{ wifis: WifiDto[]; maxWifis: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(wifisData => {
          return {
            wifis: wifisData.wifis.map(wifi => {
              return {
                id: wifi._id,
                wifiName: wifi.wifiName,
                wifiFrequancy: wifi.wifiFrequancy,
                wifiRange: wifi.wifiRange,
                wifiDataRate: wifi.wifiDataRate
              };
            }),
            maxWifis: wifisData.maxWifis
          };
        })
      )
      .subscribe(
        transformedWifisData => {
          this.wifis = transformedWifisData.wifis;
          this.logger.log(this.componentName, this.wifis);
          this.wifisUpdated$.next({
            wifis: [...this.wifis],
            maxWifis: transformedWifisData.maxWifis
          });
        },
        error => {
          this.logger.error(this.componentName + error);
        }
      );
  }
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
