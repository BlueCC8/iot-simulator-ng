import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { PlaygroundService } from '../../playground.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';

import { NGXLogger } from 'ngx-logger';
import { RoomService } from '../room.service';
import { AuthService } from 'src/app/auth/auth.service';
import { RoomPolygonsModel } from '../room-polygon.model';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit, OnDestroy {
  private componentName = RoomListComponent.name + ' ';
  defaultValue = 'Select room';
  rooms: RoomPolygonsModel[] = [];
  isLoading = false;
  roomsPerPage = null;
  userIsAuthenticated = false;
  currentPage = null;
  isPopulated = true;
  username: string;
  totalRooms = 0;

  authListenerSubs = new Subscription();
  roomsSubs = new Subscription();
  constructor(
    private logger: NGXLogger,
    private authService: AuthService,
    private roomsService: RoomService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.roomsService.getRooms(this.roomsPerPage, this.currentPage, this.isPopulated);
    this.username = this.authService.getUsername();

    this.roomsSubs = this.roomsService
      .getRoomUpdateStatus()
      .subscribe((roomsData: { rooms: RoomPolygonsModel[]; maxRooms: number }) => {
        this.isLoading = false;
        this.rooms = roomsData.rooms;
        this.totalRooms = roomsData.maxRooms;
        this.logger.log(this.componentName, this.rooms);
      });

    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.username = this.authService.getUsername();
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.roomsSubs.unsubscribe();
  }
}
