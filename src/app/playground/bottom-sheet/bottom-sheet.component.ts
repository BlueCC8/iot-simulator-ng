import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, MatSelectionList } from '@angular/material';
import { SetupDevicesModel } from '../setup/setupDevices.model';
import { SetupService } from '../setup/setup.service';
import { SetupDataDto } from '../setup/setup.data-dto';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: 'bottom-sheet.component.html',
  styleUrls: ['bottom-sheet.component.css']
})
export class BottomSheetComponent {
  selectedDevices = [];
  selectedOption;
  constructor(
    private setupsService: SetupService,
    private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: SetupDevicesModel
  ) {
    console.log(data);
  }
  onSave(selectionList: MatSelectionList) {
    // const difference = this.data.devIDs.filter(x => !this.selectedOption.includes(x));
    console.log(this.data);
    console.log(this.selectedOption);
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
  onNgModelChange($event) {
    console.log($event);
    this.selectedOption = $event;
  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
