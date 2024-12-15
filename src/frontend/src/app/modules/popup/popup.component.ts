import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string; success: boolean },
    private dialogRef: MatDialogRef<PopupComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
