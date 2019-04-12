import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { PlaygroundService } from '../playground.service';
import { Subscription } from 'rxjs';
import { BoardModel } from './board.model';
import { MatDialog } from '@angular/material';
import { DeviceIntegratedModel } from 'src/app/pages/device/device.integrated-model';
import { SaveDialogComponent } from '../save-dialog/save-dialog.component';
import { NGXLogger } from 'ngx-logger';

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

  constructor(
    private dialog: MatDialog,
    private playgroundService: PlaygroundService,
    private logger: NGXLogger
  ) {}

  ngOnInit() {
    this.deviceSub = this.playgroundService.getDeviceStatus().subscribe(
      device => {
        this.boardDevices.push({ devName: device.devName, imgPath: device.devImgUrl });
        this.boardDevicesIDs.push(device.id);
      },
      error => {
        this.logger.error(this.componentName + error);
      }
    );
  }
  onSaveConfig() {
    this.dialog.open(SaveDialogComponent, { data: this.boardDevicesIDs });
  }
  ngOnDestroy() {
    this.deviceSub.unsubscribe();
  }
}
