import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent {
  @Output() fileLoaded = new EventEmitter<string>();  // Emite el contenido del archivo

  constructor(private fileUploadService: FileUploadService, private router: Router) {}
  

  logout() {
    localStorage.removeItem('token'); // Elimina el token
    this.router.navigate(['/login']); // Redirige al login
    console.log("SALI")
  }

  onFileLoad(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileUploadService.readFile(file).subscribe(
        (content) => {
          this.fileLoaded.emit(content);  // Emitir el contenido procesado como string
        },
        (error) => {
          console.error('Error al leer el archivo:', error);
        }
      );
    }
  }
}
