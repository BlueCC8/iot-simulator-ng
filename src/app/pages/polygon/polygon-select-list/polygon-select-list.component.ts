import { PolygonModel } from 'src/app/core/models/polygon.model';
import { Subscription } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from 'src/app/auth/auth.service';
import { PolygonsService } from 'src/app/core/services/polygon.service';
import { OnInit, OnDestroy, Component } from '@angular/core';
import { RoomService } from 'src/app/core/services/room.service';

@Component({
  selector: 'app-select-polygon-list',
  templateUrl: './polygon-select-list.component.html',
  styleUrls: ['./polygon-select-list.component.css']
})
export class PolygonSelectListComponent implements OnInit, OnDestroy {
  private componentName = PolygonSelectListComponent.name + ' ';
  defaultValue = 'Select polygon';
  selected: PolygonModel;
  polygons: PolygonModel[] = [];
  isLoading = false;
  polygonsPerPage = null;
  userIsAuthenticated = false;
  currentPage = null;
  isPopulated = false;
  username: string;
  roomsPopulated = false;
  roomsPerPage = null;
  totalPolygons = 0;

  authListenerSubs$ = new Subscription();
  polygonsSubs$ = new Subscription();
  polygonSubs$ = new Subscription();
  constructor(
    private logger: NGXLogger,
    private authService: AuthService,
    private polygonsService: PolygonsService,
    private roomsService: RoomService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.polygonsService.getPolygons(this.polygonsPerPage, this.currentPage);
    this.username = this.authService.getUsername();

    this.polygonsSubs$ = this.polygonsService
      .getPolygonUpdateListener()
      .subscribe((polygonsData: { polygons: PolygonModel[]; maxPolygons: number }) => {
        this.isLoading = false;
        this.polygons = polygonsData.polygons;
        this.totalPolygons = polygonsData.maxPolygons;
        this.logger.log(this.componentName, this.polygons);
      });
    this.polygonSubs$ = this.polygonsService
      .getPolygonSelectedListener()
      .subscribe((polygon: PolygonModel) => {
        this.selected = polygon;
        this.logger.log(this.componentName, 'Selected', polygon);
      });
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs$ = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.username = this.authService.getUsername();
    });
  }
  onSelected(polygon: PolygonModel) {
    this.logger.log(this.componentName, polygon);

    // this.roomsService.getRooms(
    //   this.roomsPerPage,
    //   this.currentPage,
    //   this.roomsPopulated,
    //   polygon.id
    // );
    this.polygonsService.setPolygonSelected(polygon);
  }
  ngOnDestroy() {
    this.polygonSubs$.unsubscribe();
    this.authListenerSubs$.unsubscribe();
    this.polygonsSubs$.unsubscribe();
  }
}
