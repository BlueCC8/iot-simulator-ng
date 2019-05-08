// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { CdkDragDrop } from '@angular/cdk/drag-drop';
// import { PlaygroundService } from '../../../core/services/playground.service';
// import { Subscription } from 'rxjs';
// import { MatDialog } from '@angular/material';

// import { NGXLogger } from 'ngx-logger';
// import { RoomService } from '../../../core/services/room.service';
// import { AuthService } from 'src/app/auth/auth.service';
// import { RoomPolygonsModel } from '../../../core/models/room-polygon.model';
// import { RoomModel } from '../../../core/models/room.model';
// import { SetupService } from '../../../core/services/setup.service';

// @Component({
//   selector: 'app-room-list',
//   templateUrl: './room-list.component.html',
//   styleUrls: ['./room-list.component.css']
// })
// export class RoomListComponent implements OnInit, OnDestroy {
//   private componentName = RoomListComponent.name + ' ';
//   defaultValue = 'Select room';
//   selected = '';
//   rooms: RoomPolygonsModel[] = [];
//   isLoading = false;
//   roomsPerPage = null;
//   userIsAuthenticated = false;
//   currentPage = null;
//   isPopulated = false;
//   setupPopulated = true;
//   username: string;
//   setupsPerPage = null;

//   totalRooms = 0;

//   authListenerSubs$ = new Subscription();
//   roomsSubs$ = new Subscription();
//   constructor(
//     private logger: NGXLogger,
//     private authService: AuthService,
//     private roomsService: RoomService,
//     private setupsService: SetupService
//   ) {}

//   ngOnInit() {
//     this.isLoading = true;
//     this.roomsService.getRooms(this.roomsPerPage, this.currentPage, this.isPopulated);
//     this.username = this.authService.getUsername();

//     this.roomsSubs$ = this.roomsService
//       .getRoomUpdateStatus()
//       .subscribe((roomsData: { rooms: RoomPolygonsModel[]; maxRooms: number }) => {
//         this.isLoading = false;
//         this.rooms = roomsData.rooms;
//         this.totalRooms = roomsData.maxRooms;
//         this.logger.log(this.componentName, this.rooms);
//       });

//     this.userIsAuthenticated = this.authService.getIsAuthenticated();
//     this.authListenerSubs$ = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
//       this.userIsAuthenticated = isAuthenticated;
//       this.username = this.authService.getUsername();
//     });
//   }
//   onSelected(room: RoomModel) {
//     this.logger.log(this.componentName, room.configDevIDs);
//     const configIds = room.configDevIDs;
//     this.setupsService.getSetups(
//       this.setupsPerPage,
//       this.currentPage,
//       this.setupPopulated,
//       configIds
//     );
//     this.roomsService.setRoomSelected(room);
//   }
//   ngOnDestroy() {
//     this.authListenerSubs$.unsubscribe();
//     this.roomsSubs$.unsubscribe();
//   }
// }
