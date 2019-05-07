import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LinkLayerModel } from '../models/linkLayer.model';
import { NGXLogger } from 'ngx-logger';
import { LinkLayerDto } from '../dtos/linkLayer.dto';

const BACKEND_URL = environment.apiUrl + '/link_layer/';
@Injectable({ providedIn: 'root' })
export class LinkLayersService {
  linkLayers: LinkLayerModel[] = [];
  private componentName = LinkLayersService.name + ' ';
  private linkLayersUpdated$ = new Subject<{
    linkLayers: LinkLayerModel[];
    maxLinkLayers: number;
  }>();

  constructor(private http: HttpClient, private router: Router, private logger: NGXLogger) {}

  // * Listener to be able to provide subscription to othe components
  getLinkLayersUpdateListener() {
    return this.linkLayersUpdated$.asObservable();
  }
  getLinkLayers(pageSize: number, page: number) {
    let queryParams = '';
    if (pageSize && page) {
      queryParams = `?pagesize=${pageSize}&page=${page}`;
    }
    // this.logger.log(this.componentName + 'query params', queryParams);
    this.http
      .get<{ linkLayers: LinkLayerDto[]; maxLinkLayers: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(linkLayersData => {
          return {
            linkLayers: linkLayersData.linkLayers.map(linkLayer => {
              return {
                id: linkLayer._id,
                llName: linkLayer.llName,
                llPriorityType: linkLayer.llPriorityType,
                llRole: linkLayer.llRole,
                llBluetooth: linkLayer.llBluetooth,
                llLrWpan: linkLayer.llLrWpan,
                llLrWpanType: linkLayer.llLrWpanType,
                llCelullar: linkLayer.llCelullar,
                llNFC: linkLayer.llNFC,
                llProducer: linkLayer.llProducer,
                llWifiID: linkLayer.llWifiID,
                llEthernetID: linkLayer.llEthernetID
              };
            }),
            maxLinkLayers: linkLayersData.maxLinkLayers
          };
        })
      )
      .subscribe(
        transformedLinkLayersData => {
          this.linkLayers = transformedLinkLayersData.linkLayers;
          this.logger.log(this.componentName, this.linkLayers);
          this.linkLayersUpdated$.next({
            linkLayers: [...this.linkLayers],
            maxLinkLayers: transformedLinkLayersData.maxLinkLayers
          });
        },
        error => {
          this.logger.error(this.componentName + error);
        }
      );
  }
  updateLinLayer(linLayer: LinkLayerModel) {
    this.http.put(BACKEND_URL + linLayer.id, linLayer).subscribe(
      res => {
        // this.router.navigate(['/']);
      },
      error => {
        this.logger.error(this.componentName + error);
      }
    );
  }

  addLinLayer(linLayer: LinkLayerModel) {
    return this.http.post<string>(BACKEND_URL, linLayer).pipe(
      map(linLayerId => {
        return linLayerId;
      })
    );
  }
}
