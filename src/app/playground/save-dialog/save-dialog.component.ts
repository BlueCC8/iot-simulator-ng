import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Inject, Component } from '@angular/core';
import { DeviceIntegratedModel } from 'src/app/device/device.integrated-model';
import { NgForm } from '@angular/forms';
import { SetupModel } from '../setup/setup.model';
import { SetupIntegratedModel } from '../setup/setup.integrated-model';
import { SetupService } from '../setup/setup.service';

@Component({
  selector: 'app-save-dialog',
  templateUrl: 'save-dialog.component.html'
})
export class SaveDialogComponent {
  constructor(
    private setupsService: SetupService,
    public dialogRef: MatDialogRef<SaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string[]
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
      devIDs: this.data,
      username: null
    };
    this.dialogRef.close();
    this.setupsService.addSetup(setup);
  }
}
