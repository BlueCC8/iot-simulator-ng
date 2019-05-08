import { Injectable } from '@angular/core';
import { PolygonModel } from '../models/polygon.model';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { HttpClient } from '@angular/common/http';
import { PolygonDto } from '../dtos/polygon.dto';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
const BACKEND_URL = environment.apiUrl + '/polygon/';

@Injectable({ providedIn: 'root' })
export class PolygonsService {
  private componentName = PolygonsService.name + ' ';
  private polygons: PolygonModel[] = [];
  private polygonsUpdated$ = new Subject<{ polygons: PolygonModel[]; maxPolygons: number }>();

  constructor(private http: HttpClient, private router: Router, private logger: NGXLogger) {}

  getPolygonUpdateListener() {
    return this.polygonsUpdated$.asObservable();
  }
  getPolygons(pageSize: number, page: number) {
    let queryParams = '';
    if (pageSize && page) {
      queryParams = `?pagesize=${pageSize}&page=${page}`;
    }
    this.http
      .get<{ polygons: PolygonDto[]; maxPolygons: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(polygonsData => {
          return {
            polygons: polygonsData.polygons.map(polygon => {
              return {
                id: polygon._id,
                polName: polygon.polName,
                polDots: polygon.polDots.map(dot => {
                  return {
                    id: dot._id,
                    dotX: dot.dotX,
                    dotY: dot.dotY
                  };
                })
              };
            }),
            maxPolygons: polygonsData.maxPolygons
          };
        })
      )
      .subscribe(
        transformedPolygonsData => {
          this.polygons = transformedPolygonsData.polygons;
          this.logger.log(this.componentName, this.polygons);
          this.polygonsUpdated$.next({
            polygons: [...this.polygons],
            maxPolygons: transformedPolygonsData.maxPolygons
          });
        },
        error => {
          this.logger.error(this.componentName + error);
        }
      );
  }
  addPolygon(polygon: PolygonModel) {
    this.http.post<string>(BACKEND_URL, polygon).pipe(
      map(polygonId => {
        return polygonId;
      })
    );
  }
  updatePolygon(polygon: PolygonModel) {
    this.http.put(BACKEND_URL + polygon.id, polygon).subscribe(res => {
      // this.router.navigate(['/']);
    });
  }
  deletePolygon(polygonId: string) {
    return this.http.delete(BACKEND_URL + polygonId);
  }
  getPolygon(id: string) {
    return this.http.get<PolygonDto>(BACKEND_URL + id).pipe(
      map(polygonData => {
        return {
          id: polygonData._id,
          polName: polygonData.polName,
          polDots: polygonData.polDots.map(dot => {
            return {
              id: dot._id,
              dotX: dot.dotX,
              dotY: dot.dotY
            };
          })
        };
      })
    );
  }
}
