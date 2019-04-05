import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { PlaygroundService } from '../playground.service';
import { Subscription } from 'rxjs';
import { BoardModel } from './board.model';
import { MatDialog } from '@angular/material';
import { DeviceIntegratedModel } from 'src/app/device/device.integrated-model';
import { SaveDialogComponent } from '../save-dialog/save-dialog.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
  boardDevices: BoardModel[] = [];
  boardDevicesIDs: string[] = [];
  deviceSub = new Subscription();
  constructor(private dialog: MatDialog, private playgroundService: PlaygroundService) {}

  ngOnInit() {
    this.deviceSub = this.playgroundService.getDeviceStatus().subscribe(device => {
      this.boardDevices.push({ devName: device.devName, imgPath: device.devImgUrl });
      this.boardDevicesIDs.push(device.id);
    });
  }
  onSaveConfig() {
    this.dialog.open(SaveDialogComponent, { data: this.boardDevicesIDs });
  }
  ngOnDestroy() {
    this.deviceSub.unsubscribe();
  }
}
