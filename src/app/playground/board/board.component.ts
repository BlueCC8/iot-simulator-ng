import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { PlaygroundService } from '../playground.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
  items = ['Get up', 'Brush teeth'];
  deviceSub = new Subscription();
  constructor(private playgroundService: PlaygroundService) {}

  ngOnInit() {
    this.deviceSub = this.playgroundService.getDeviceStatus().subscribe(device => {
      this.items.push(device.devName);
    });
  }
  onDrop(event: CdkDragDrop<string[]>) {
    console.log('Dropped');
    this.playgroundService.dropElement(event);
  }
  ngOnDestroy() {
    this.deviceSub.unsubscribe();
  }
}
