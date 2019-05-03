import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, MatSelectionList } from '@angular/material';
import { SetupDevicesModel } from '../setup/setup-devices.model';
import { SetupService } from '../setup/setup.service';
import { SetupDataDto } from '../setup/setup.data-dto';
import { NGXLogger } from 'ngx-logger';
import { BoardService } from '../board/board.service';
import { BoardModel } from '../board/board.model';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: 'bottom-sheet.component.html',
  styleUrls: ['bottom-sheet.component.css']
})
export class BottomSheetComponent {
  private componentName = BottomSheetComponent.name + ' ';

  selectedDevices = [];
  selectedOption;
  constructor(
    private logger: NGXLogger,
    private setupsService: SetupService,
    private boardsService: BoardService,
    private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: SetupDevicesModel
  ) {
    this.logger.log(this.componentName, data);
  }
  onSave(selectionList: MatSelectionList) {
    this.logger.log(this.componentName, this.data);
    this.logger.log(this.componentName, this.selectedOption);
    if (this.selectedOption) {
      const selectedIDs = this.selectedOption.map(dev => {
        return { _id: dev.id };
      });
      const setup: SetupDataDto = {
        _id: this.data.id,
        configName: this.data.setupName,
        devIDs: selectedIDs
      };
      this.setupsService.updateSetup(setup);
    }
    this.bottomSheetRef.dismiss();
  }
  onLoad(selectionList: MatSelectionList) {
    const devices: BoardModel[] = this.data.devIDs.map(device => {
      return {
        id: device.id,
        devName: device.devName,
        devImgUrl: device.devImgUrl
      };
    });
    this.boardsService.setBoardAllSelected(devices);

    this.bottomSheetRef.dismiss();
  }
  onNgModelChange($event) {
    this.logger.log(this.componentName, $event);
    this.selectedOption = $event;
  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
