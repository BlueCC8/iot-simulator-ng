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
import { Link } from 'src/app/core/d3/models/link';
import { Node } from 'src/app/core/d3/models/node';
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

  // D3 paint
  nodes: Node[] = [];
  links: Link[] = [];

  constructor(
    private dialog: MatDialog,
    private boardsService: BoardService,
    private roomsService: RoomService,
    private logger: NGXLogger
  ) {
    // const N = APP_CONFIG.N;
    const N = 8;
    /** constructing the nodes array */
    for (let i = 1; i <= N; i++) {
      this.nodes.push(new Node(i));
    }
    let source = 1;
    let target = 2;
    // this.nodes[this.getIndex(source)].linkCount++;
    // this.nodes[this.getIndex(source * target)].linkCount++;
    // this.links.push(new Link(source, source * target));

    source = 1;
    target = 3;
    this.nodes[this.getIndex(source)].linkCount++;
    this.nodes[this.getIndex(source * target)].linkCount++;
    this.links.push(new Link(source, source * target));

    source = 2;
    target = 2;
    this.nodes[this.getIndex(source)].linkCount++;
    this.nodes[this.getIndex(source * target)].linkCount++;
    this.links.push(new Link(source, source * target));
    source = 2;
    target = 3;
    this.nodes[this.getIndex(source)].linkCount++;
    this.nodes[this.getIndex(source * target)].linkCount++;
    this.links.push(new Link(source, source * target));
    source = 2;
    target = 4;
    this.nodes[this.getIndex(source)].linkCount++;
    this.nodes[this.getIndex(source * target)].linkCount++;
    this.links.push(new Link(source, source * target));

    // for (let source = 1; source <= N; source++) {
    //   for (let target = 2; source * target <= N; target++) {
    //     /** increasing connections toll on connecting nodes */
    //     this.nodes[this.getIndex(source)].linkCount++;
    //     this.nodes[this.getIndex(source * target)].linkCount++;

    //     /** connecting the nodes before starting the simulation */
    //     this.links.push(new Link(source, source * target));
    //   }
    // }
  }
  getIndex = index => index - 1;

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
