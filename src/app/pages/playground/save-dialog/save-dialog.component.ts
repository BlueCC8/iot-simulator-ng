import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Inject, Component } from '@angular/core';
import { DeviceIntegratedModel } from 'src/app/core/models/device.integrated-model';
import { NgForm } from '@angular/forms';
import { SetupModel } from '../../../core/models/setup.model';
import { SetupIntegratedModel } from '../../../core/models/setup.integrated-model';
import { SetupService } from '../../../core/services/setup.service';
import { SetupCreateDto } from '../../../core/dtos/setup.create-dto';

@Component({
  selector: 'app-save-dialog',
  templateUrl: 'save-dialog.component.html'
})
export class SaveDialogComponent {
  constructor(
    private setupsService: SetupService,
    public dialogRef: MatDialogRef<SaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public setupData: SetupCreateDto
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  onConfirm(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const setup: SetupModel = {
      id: null,
      setupName: form.value.configName,
      devIDs: this.setupData.devIDs,
      roomId: this.setupData.roomId,
      username: null
    };
    this.dialogRef.close();
    this.setupsService.addSetup(setup);
  }
}
