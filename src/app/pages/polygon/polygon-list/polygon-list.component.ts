import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PageEvent } from '@angular/material';
import { AuthService } from '../../../auth/auth.service';
import { PolygonModel } from 'src/app/core/models/polygon.model';
import { PolygonsService } from 'src/app/core/services/polygon.service';

@Component({
  selector: 'app-polygon-list',
  templateUrl: './polygon-list.component.html',
  styleUrls: ['./polygon-list.component.css']
})
export class PolygonListComponent implements OnInit, OnDestroy {
  polygons: PolygonModel[] = [];
  userIsAuthenticated = false;
  username: string;
  isLoading = false;
  isPopulated = true;
  totalPolygons = 0;
  polygonsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private polygonsSub$ = new Subscription();
  private authListenerSubs$ = new Subscription();
  constructor(public polygonsService: PolygonsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.polygonsService.getPolygons(this.polygonsPerPage, this.currentPage);
    this.username = this.authService.getUsername();
    this.polygonsSub$ = this.polygonsService
      .getPolygonUpdateListener()
      .subscribe((polygonsData: { polygons: PolygonModel[]; maxPolygons: number }) => {
        this.isLoading = false;
        this.polygons = polygonsData.polygons;
        this.totalPolygons = polygonsData.maxPolygons;
      });
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs$ = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.username = this.authService.getUsername();
    });
  }
  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.totalPolygons = pageData.length;
    this.polygonsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.polygonsService.getPolygons(this.polygonsPerPage, this.currentPage);
  }

  onDelete(polygonId: string) {
    this.isLoading = true;
    this.polygonsService.deletePolygon(polygonId).subscribe(() => {
      this.polygonsService.getPolygons(this.polygonsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.polygonsSub$.unsubscribe();
    this.authListenerSubs$.unsubscribe();
  }
}
