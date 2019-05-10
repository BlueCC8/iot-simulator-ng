import { Injectable } from '@angular/core';
import { DeviceIntegratedModel } from '../models/device.integrated-model';
import { Subject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { RoomModel } from '../models/room.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RoomPolygonsDto } from '../dtos/room-polygon.dto';
import { RoomPolygonsModel } from '../models/room-polygon.model';
import { map } from 'rxjs/operators';
import { PolygonModel } from '../models/polygon.model';
import { DotModel } from '../models/dot.model';
import { RoomDto } from '../dtos/room.dto';
import { Router } from '@angular/router';
const BACKEND_URL = environment.apiUrl + '/room/';
@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private componentName = RoomService.name + ' ';
  private rooms: RoomPolygonsModel[] = [];
  private currentRoom: RoomModel;
  private polygonId: string;
  private roomsUpdated$ = new Subject<{ rooms: RoomPolygonsModel[]; maxRooms: number }>();
  private roomSelectedListener$ = new Subject<RoomModel>();

  constructor(private logger: NGXLogger, private http: HttpClient, private router: Router) {}
  getRoomUpdateStatus() {
    return this.roomsUpdated$.asObservable();
  }
  getRoomSelectedListener() {
    return this.roomSelectedListener$.asObservable();
  }
  setRoomSelected(room: RoomModel) {
    this.currentRoom = room;
    this.roomSelectedListener$.next(room);
  }
  getRooms(pageSize: number, page: number, isPopulated: boolean) {
    let queryParams = '';
    if (pageSize && page) {
      queryParams = `?pagesize=${pageSize}&page=${page}&populated=${isPopulated}`;
    } else {
      queryParams = `?populated=${isPopulated}`;
    }

    this.http
      .get<{ rooms: RoomPolygonsDto[]; maxRooms: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(roomsData => {
          this.logger.log(this.componentName, roomsData);
          return {
            rooms: roomsData.rooms.map(room => {
              let dots: DotModel[] = [];
              let polygon: PolygonModel = null;

              if (room.polID) {
                const polygonDto = room.polID;
                if (room.polID.polDots) {
                  dots = room.polID.polDots.map(dot => {
                    return {
                      id: dot._id,
                      dotX: dot.dotX,
                      dotY: dot.dotY
                    };
                  });
                  polygon = {
                    id: polygonDto._id,
                    polName: polygonDto.polName,
                    polDots: dots,
                    username: polygonDto.username
                  };
                }
              }

              return {
                id: room._id,
                roomName: room.roomName,
                roomType: room.roomType,
                roomHeight: room.roomHeight,
                polID: polygon,
                configDevIDs: room.configDevIDs,
                username: room.username
              };
            }),
            maxRooms: roomsData.maxRooms
          };
        })
      )
      .subscribe(
        transformedRoomsData => {
          this.logger.log(this.componentName, transformedRoomsData.rooms);
          this.rooms = transformedRoomsData.rooms;
          this.roomsUpdated$.next({
            rooms: [...this.rooms],
            maxRooms: transformedRoomsData.maxRooms
          });
        },
        error => {
          this.logger.error(this.componentName + error);
        }
      );
  }

  addRoom(room: RoomModel) {
    this.logger.log(this.componentName, room);

    this.http.post<{ room: RoomModel }>(BACKEND_URL, room).subscribe(
      responseData => {
        this.logger.log(this.componentName, responseData);
        this.router.navigate(['./']);
      },
      error => {
        this.logger.error(this.componentName + error);
      }
    );
  }
  updateRoom(room: RoomModel) {
    this.logger.log(this.componentName, room);
    this.http.put(BACKEND_URL + room.id, room).subscribe(
      res => {
        this.router.navigate(['./']);
      },
      error => {
        this.logger.error(this.componentName + error);
      }
    );
  }
  deleteRoom(roomId: string) {
    return this.http.delete(BACKEND_URL + roomId);
  }
  getRoom(id: string) {
    return this.http.get<RoomDto>(BACKEND_URL + id).pipe(
      map(roomData => {
        return {
          id: roomData._id,
          roomName: roomData.roomName,
          roomType: roomData.roomType,
          roomHeight: roomData.roomHeight,
          polID: roomData.polID,
          configDevIDs: roomData.configDevIDs,
          username: roomData.username
        };
      })
    );
  }
}
