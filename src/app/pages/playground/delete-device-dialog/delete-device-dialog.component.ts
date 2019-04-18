import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Inject, Component } from '@angular/core';
import { BoardService } from '../board/board.service';

@Component({
  selector: 'app-delete-device-dialog',
  templateUrl: 'delete-device-dialog.component.html'
})
export class DeleteDeviceDialogComponent {
  constructor(
    private boardsService: BoardService,
    public dialogRef: MatDialogRef<DeleteDeviceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public deviceId: string
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  onConfirm() {
    this.dialogRef.close();
    this.boardsService.removeBoardDeviceSelected(this.deviceId);
  }
}
