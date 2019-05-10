import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PageEvent } from '@angular/material';
import { AuthService } from '../../../auth/auth.service';
import { RoomService } from 'src/app/core/services/room.service';
import { RoomPolygonsModel } from 'src/app/core/models/room-polygon.model';
import { RoomModel } from 'src/app/core/models/room.model';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit, OnDestroy {
  rooms: RoomPolygonsModel[] = [];
  userIsAuthenticated = false;
  username: string;
  isLoading = false;
  isPopulated = true;
  polId: string;
  totalRooms = 0;
  roomsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private roomsSub$ = new Subscription();
  private authListenerSubs$ = new Subscription();
  constructor(public roomsService: RoomService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.roomsService.getRooms(this.roomsPerPage, this.currentPage, this.isPopulated);
    this.username = this.authService.getUsername();
    this.roomsSub$ = this.roomsService
      .getRoomUpdateStatus()
      .subscribe((roomsData: { rooms: RoomPolygonsModel[]; maxRooms: number }) => {
        this.isLoading = false;
        this.rooms = roomsData.rooms;
        this.totalRooms = roomsData.maxRooms;
      });
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs$ = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.username = this.authService.getUsername();
    });
  }
  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.totalRooms = pageData.length;
    this.roomsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.roomsService.getRooms(this.roomsPerPage, this.currentPage, this.isPopulated);
  }

  onDelete(roomId: string) {
    this.isLoading = true;
    this.roomsService.deleteRoom(roomId).subscribe(() => {
      this.roomsService.getRooms(this.roomsPerPage, this.currentPage, this.isPopulated);
    });
  }

  ngOnDestroy() {
    this.roomsSub$.unsubscribe();
    this.authListenerSubs$.unsubscribe();
  }
}
