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
  fileContent: any[] = []// Variable para almacenar el contenido del archivo
  selectedFileName: string = 'No se ha seleccionado ningún archivo';
  files: any[] = [];
  constructor(private router: Router, private fileUploadService: FileUploadService) { }

  onFilesFetched(data: any[]): void {
    console.log('Datos recibidos en el componente padre:', data);
    this.fileContent = data; // Pasar los datos al grafo-component
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  isAuthenticated(): boolean {
    // Simulación de autenticación: verifica si hay un token almacenado
    return !!localStorage.getItem('token');
  }
/*
  onFileLoaded(event: { content: string; fileName: string }): void {
    this.fileContent = event.content;
    this.selectedFileName = event.fileName;
  }

  onFilesFetched(files: any[]): void {
    this.files = files; // Actualizar la lista de archivos
  }
*/
  /*onFileLoadedName(fileName: string) {
    this.selectedFileName = fileName;
  }*/
}
