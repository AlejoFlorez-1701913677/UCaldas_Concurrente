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
  fileContent: any[] = []; // Almacena el contenido del archivo seleccionado
  selectedFileName: string = 'No se ha seleccionado ningún archivo'; // Nombre del archivo seleccionado

  constructor(private router: Router, private fileUploadService: FileUploadService) {}

  // Método para recibir los datos del archivo seleccionado
  onFileSelected(data: any): void {
    console.log('Datos recibidos del archivo:', data);
    this.fileContent = data.content; // Contenido del archivo
    this.selectedFileName = data.fileName; // Nombre del archivo
  }

  // Métodos auxiliares
  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  isAuthenticated(): boolean {
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
