import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent {

  selectedFile = null;

  constructor(private fileUploadService: FileUploadService, private router: Router) { }


  logout() {
    localStorage.removeItem('token'); // Elimina el token
    this.router.navigate(['/login']); // Redirige al login
  }

  onFileLoad(event: any): void {
    this.selectedFile = event.target.files[0];
    this.upload();
  }

  onFileLoad2(event: any): void {
    this.selectedFile = event.target.files[0];
    this.upload2();
  }

  upload(): void {
    if (this.selectedFile) {
      this.fileUploadService.upload(this.selectedFile).subscribe(response => {
        console.log('Archivo subido con éxito', response);
      }, error => {
        console.error('Error al subir archivo', error);
      });
    }
  }
  
  upload2(): void {
    if (this.selectedFile) {
      this.fileUploadService.upload2(this.selectedFile).subscribe(response => {
        console.log('Archivo subido con éxito 2', response);
      }, error => {
        console.error('Error al subir archivo 2', error);
      });
    }
  }


}
