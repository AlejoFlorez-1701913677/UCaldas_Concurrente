import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.css']
})
export class FileSelectorComponent {
  @Input() files: any[] = [];  // Recibe los archivos
  @Output() fileSelected = new EventEmitter<string>();

  constructor(public dialogRef: MatDialogRef<FileSelectorComponent>, @Inject(MAT_DIALOG_DATA) public data: { files: any[] }) {}
  
  selectFile(file: any): void {
    this.fileSelected.emit(file.name); // Emite el nombre del archivo seleccionado
    this.dialogRef.close(file.name);
  }

  close(): void {
    this.fileSelected.emit(); // Emite si no se seleccionó ningún archivo
    this.dialogRef.close()
  }
  cancel(): void {
    this.dialogRef.close();  // Si se cancela, no pasa nada
  }

}
