import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoomPolygonsModel } from 'src/app/core/models/room-polygon.model';
import { RoomModel } from 'src/app/core/models/room.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RoomService } from 'src/app/core/services/room.service';
import { AuthService } from 'src/app/auth/auth.service';
import { NGXLogger } from 'ngx-logger';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PolygonsService } from 'src/app/core/services/polygon.service';
import { PolygonModel } from 'src/app/core/models/polygon.model';

@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.component.html',
  styleUrls: ['./room-create.component.css']
})
export class RoomCreateComponent implements OnInit, OnDestroy {
  componentName = RoomCreateComponent.name;
  polygon: PolygonModel;
  room: RoomModel;
  defaultX = 0;
  defaultY = 0;
  form: FormGroup;
  isLoading = false;
  private mode = 'create';
  private roomId: string;
  private authListenerSubs$ = new Subscription();
  private polygonSubs$ = new Subscription();

  constructor(
    private roomsService: RoomService,
    private polygonsService: PolygonsService,
    private authService: AuthService,
    public route: ActivatedRoute,
    private logger: NGXLogger,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    this.authListenerSubs$ = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.polygonSubs$ = this.polygonsService
      .getPolygonSelectedListener()
      .subscribe((polygon: PolygonModel) => {
        this.polygon = polygon;
      });
    this.form = this.formBuilder.group({
      roomName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      roomType: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      roomHeight: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.logger.log(this.componentName, 'Editing mode');

      if (paramMap.has('roomId')) {
        this.mode = 'edit';
        this.roomId = paramMap.get('roomId');
        this.isLoading = true;
        // * Get instance
        this.roomsService.getRoom(this.roomId).subscribe(roomData => {
          this.isLoading = false;
          this.logger.log(this.componentName, roomData);

          this.room = {
            id: roomData.id,
            roomName: roomData.roomName,
            roomType: roomData.roomType,
            roomHeight: roomData.roomHeight,
            polID: roomData.polID,
            configDevIDs: roomData.configDevIDs,
            username: roomData.username
          };
          this.polygonsService.getPolygon(this.room.polID).subscribe(polygon => {
            this.polygonsService.setPolygonSelected(polygon);
          });
          // * Set values
          this.form.setValue({
            roomName: roomData.roomName,
            roomType: roomData.roomType,
            roomHeight: roomData.roomHeight
          });
        });
      } else {
        this.mode = 'create';
        this.roomId = null;
      }
    });
  }
  onSaveRoom() {
    if (this.form.invalid) {
      return;
    }
    const room: RoomModel = {
      id: null,
      roomName: this.form.value.roomName,
      roomType: this.form.value.roomType,
      roomHeight: this.form.value.roomHeight,
      configDevIDs: [],
      polID: this.polygon.id ? this.polygon.id : '',
      username: this.authService.getUsername()
    };
    this.logger.log(this.componentName, ' room', room);
    this.isLoading = true;

    if (this.mode === 'create') {
      this.roomsService.addRoom(room);
      this.logger.log(this.componentName, 'Create room', room);
    } else {
      room.configDevIDs = this.room.configDevIDs;
      room.id = this.roomId;
      this.roomsService.updateRoom(room);
      this.logger.log(this.componentName, 'Success edit');
    }
    this.form.reset();
  }
  ngOnDestroy() {
    this.polygonSubs$.unsubscribe();
    this.authListenerSubs$.unsubscribe();
  }
}
