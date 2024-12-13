import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigServiceService } from 'src/app/services/config-service.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent {
  @Output() fileUploaded = new EventEmitter<any>();
  @Output() filesFetched = new EventEmitter<any[]>();

  selectedFile = null;

  constructor(
    private fileUploadService: FileUploadService, 
    private router: Router, 
    private http: HttpClient, 
    private configService: ConfigServiceService
  ) { }


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
        console.log('respuesta', response);
        this.fileUploaded.emit(response)
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

  fetchFiles(posStart: number, posEnd: number, limit: number): void {
    const params = { 
      /*pos_start: posStart, 
      pos_end: posEnd,*/ 
      limit: limit};
    
  
    this.http.get<any[]>(`${this.configService.apiUrl}/genomeQuery/genomes`, { params }).subscribe({
      next: (response: any[]) => {
        console.log('Archivos obtenidos', response);
        this.filesFetched.emit(response); // Emitir los archivos obtenidos
      },
      error: (error) => {
        console.error('Error al obtener los archivos:', error);
      }
    });
  }
  

}
