import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { PlaygroundService } from '../playground.service';
import { Subscription } from 'rxjs';
import { BoardModel } from './board.model';
import { MatDialog } from '@angular/material';
import { SaveDialogComponent } from './save-dialog/save-dialog.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
  devices: BoardModel[] = [];
  deviceSub = new Subscription();
  constructor(private dialog: MatDialog, private playgroundService: PlaygroundService) {}

  ngOnInit() {
    this.deviceSub = this.playgroundService.getDeviceStatus().subscribe(device => {
      this.devices.push({ devName: device.devName, imgPath: device.devImgUrl });
    });
  }
  onSaveConfig() {
    this.dialog.open(SaveDialogComponent, { data: null });
  }
  onDrop(event: CdkDragDrop<string[]>) {
    console.log('Dropped');
    this.playgroundService.dropElement(event);
  }
  ngOnDestroy() {
    this.deviceSub.unsubscribe();
  }
}
