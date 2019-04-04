import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Inject, Component } from '@angular/core';
import { DeviceIntegratedModel } from 'src/app/device/device.integrated-model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-save-dialog',
  templateUrl: 'save-dialog.component.html'
})
export class SaveDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeviceIntegratedModel[]
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  onConfirm(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const configuration = {
      configName: form.value.configName
    };
    this.dialogRef.close();
    console.log(configuration);
    // this.authService.loginUser(user);
  }
}
