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
const BACKEND_URL = environment.apiUrl + '/room/';
@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private componentName = RoomService.name + ' ';
  private rooms: RoomPolygonsModel[] = [];
  private currentRoom: RoomModel;
  private roomsUpdated$ = new Subject<{ rooms: RoomPolygonsModel[]; maxRooms: number }>();
  private roomSelectedListener$ = new Subject<RoomModel>();

  constructor(private logger: NGXLogger, private http: HttpClient) {}
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
                    polDots: dots
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
}
