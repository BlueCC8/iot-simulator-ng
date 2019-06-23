import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { PlaygroundService } from '../../../core/services/playground.service';
import { Subscription } from 'rxjs';
import { BoardModel } from '../../../core/models/board.model';
import { MatDialog } from '@angular/material';
import { DeviceIntegratedModel } from 'src/app/core/models/device.integrated-model';
import { SaveDialogComponent } from '../save-dialog/save-dialog.component';
import { NGXLogger } from 'ngx-logger';
import { DeleteDeviceDialogComponent } from '../delete-device-dialog/delete-device-dialog.component';
import { BoardService } from '../../../core/services/board.service';
import { RoomService } from '../../../core/services/room.service';
import { RoomModel } from '../../../core/models/room.model';
import { SetupCreateDto } from '../../../core/dtos/setup.create-dto';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
  private componentName = BoardComponent.name + ' ';
  boardDevices: BoardModel[] = [];
  boardDevicesIDs: string[] = [];
  currentRoom: RoomModel;
  deviceSub$ = new Subscription();
  roomSub$ = new Subscription();
  preventSingleClick = false;
  timer: any;
  delay: number;

  constructor(
    private dialog: MatDialog,
    private boardsService: BoardService,
    private roomsService: RoomService,
    private logger: NGXLogger
  ) {}

  ngOnInit() {
    this.deviceSub$ = this.boardsService.getBoardDeviceStatus().subscribe(
      devices => {
        this.boardDevices = devices;
        this.boardDevicesIDs = devices.map(device => device.id);
      },
      error => {
        this.logger.error(this.componentName + error);
      }
    );
    this.roomSub$ = this.roomsService.getRoomSelectedListener().subscribe(
      room => {
        this.currentRoom = room;
      },
      error => {
        this.logger.error(this.componentName + error);
      }
    );
  }
  doubleClick(event, deviceId) {
    this.preventSingleClick = true;
    clearTimeout(this.timer);
    console.log(deviceId);
    this.dialog.open(DeleteDeviceDialogComponent, { data: deviceId });
  }
  onSaveConfig() {
    this.boardDevicesIDs = this.boardsService.removeDuplicateSym(this.boardDevicesIDs);
    this.logger.log(this.componentName, this.boardDevicesIDs);
    const setupData: SetupCreateDto = {
      configName: '',
      devIDs: this.boardDevicesIDs,
      roomId: this.currentRoom.id
    };
    console.log(setupData);
    this.dialog.open(SaveDialogComponent, { data: setupData });
  }
  ngOnDestroy() {
    this.deviceSub$.unsubscribe();
  }
}
