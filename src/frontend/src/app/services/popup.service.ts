import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopupComponent } from '../modules/popup/popup.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  constructor(private dialog: MatDialog) {}

  showMessage(message: string, success: boolean): Observable<void> {
    const config: MatDialogConfig = {
      width: '300px',
      data: { message, success }
    };
    const dialogRef = this.dialog.open(PopupComponent, config);
    return dialogRef.afterClosed();
  }
}
