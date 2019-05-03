import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { PlaygroundService } from '../playground.service';
import { Subscription } from 'rxjs';
import { BoardModel } from './board.model';
import { MatDialog } from '@angular/material';
import { DeviceIntegratedModel } from 'src/app/pages/device/device.integrated-model';
import { SaveDialogComponent } from '../save-dialog/save-dialog.component';
import { NGXLogger } from 'ngx-logger';
import { DeleteDeviceDialogComponent } from '../delete-device-dialog/delete-device-dialog.component';
import { BoardService } from './board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
  private componentName = BoardComponent.name + ' ';
  boardDevices: BoardModel[] = [];
  boardDevicesIDs: string[] = [];
  deviceSub = new Subscription();
  preventSingleClick = false;
  timer: any;
  delay: number;

  constructor(
    private dialog: MatDialog,
    private boardsService: BoardService,
    private logger: NGXLogger
  ) {}

  ngOnInit() {
    this.deviceSub = this.boardsService.getBoardDeviceStatus().subscribe(
      devices => {
        this.boardDevices = devices;
        this.boardDevicesIDs = devices.map(device => device.id);
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
    this.dialog.open(SaveDialogComponent, { data: this.boardDevicesIDs });
  }
  ngOnDestroy() {
    this.deviceSub.unsubscribe();
  }
}
