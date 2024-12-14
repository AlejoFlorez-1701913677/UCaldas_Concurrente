import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigServiceService } from 'src/app/services/config-service.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { MatDialog } from '@angular/material/dialog';
import { FileSelectorComponent } from 'src/app/modules/file-selector/file-selector.component';


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
    private configService: ConfigServiceService,
    private dialog: MatDialog
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

  fetchFiles(): void {
    

    this.http.get<any[]>(`${this.configService.apiUrl}/genomeQuery/genomes`).subscribe({
      next: (response: any[]) => {
        console.log('Archivos obtenidos', response);
        this.filesFetched.emit(response); // Emitir los archivos obtenidos
      },
      error: (error) => {
        console.error('Error al obtener los archivos:', error);
      }
    });
  }

  //PRUEBAS DE SELECTOR DE ARCHIVOS POR NOMBRE

  // Método que maneja la carga del archivo
  loadFileData(fileName: string): void {
    //const fileUrl = `https://archivosconcu.free.beeceptor.com/todos`; // URL de los archivos

    this.http.get('https://concurrente.free.beeceptor.com/todos', { responseType: 'text' }).subscribe(
  (response) => {
    try {
      const files = JSON.parse(response);
      const dialogRef = this.dialog.open(FileSelectorComponent, {
        data: { files: files },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadFileData(result);
        }
      });
    } catch (err) {
      console.error('Error al parsear JSON:', err);
      alert('Hubo un problema al procesar los archivos. Por favor, verifica el formato.');
    }
  },
  (error) => {
    console.error('Error al obtener archivos:', error.message || error);
    alert('Hubo un problema al obtener los archivos. Inténtalo nuevamente.');
  }
);
  }

  // Método que abre el selector de archivos
  openFileSelector(): void {
    // Hacer una solicitud GET a la URL
    this.http.get<any[]>('https://concurrente.free.beeceptor.com/todos').subscribe(
      (files) => {
        // Abre el modal de selección de archivo y pasa los archivos
        const dialogRef = this.dialog.open(FileSelectorComponent, {
          data: { files: files },  // Pasa los archivos obtenidos a FileSelectorComponent
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadFileData(result); // Llama a la carga de datos del archivo seleccionado
          }
        });
      },
      (error) => {
        console.error('Error al obtener archivos:', error);
      }
    );
  }
  


}
