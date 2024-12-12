import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FileUploadService } from './services/file-upload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Proyecto Concurrente';
  fileContent: string | null = null; // Variable para almacenar el contenido del archivo
  selectedFileName: string = 'No se ha seleccionado ningún archivo';
  constructor(private router: Router, private fileUploadService: FileUploadService) { }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  isAuthenticated(): boolean {
    // Simulación de autenticación: verifica si hay un token almacenado
    return !!localStorage.getItem('token');
  }

  onFileLoaded(event: { content: string; fileName: string }): void {
    this.fileContent = event.content;
    this.selectedFileName = event.fileName;
  }

  /*onFileLoadedName(fileName: string) {
    this.selectedFileName = fileName;
  }*/
}
