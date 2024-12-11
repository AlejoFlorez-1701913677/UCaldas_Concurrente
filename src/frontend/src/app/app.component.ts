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

  constructor(private router: Router, private fileUploadService: FileUploadService) {}

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  isAuthenticated(): boolean {
    // Simulación de autenticación: verifica si hay un token almacenado
    return !!localStorage.getItem('token');
  }

  onFileLoaded(content: string): void {
    this.fileContent = content; // Almacena el contenido del archivo
  }
}
