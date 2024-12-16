import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigServiceService } from 'src/app/services/config-service.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { MatDialog } from '@angular/material/dialog';
import { FileSelectorComponent } from 'src/app/modules/file-selector/file-selector.component';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent {
  @Output() fileUploaded = new EventEmitter<any>();
  @Output() filesFetched = new EventEmitter<any>();
  @Input() selectedFileName: string = '';  // Recibimos el fileName
  private fileDataSubject = new BehaviorSubject<any>(null);
  fileData$ = this.fileDataSubject.asObservable();

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
        this.filesFetched.emit({response, fileName: ""}); // Emitir los archivos obtenidos
      },
      error: (error) => {
        console.error('Error al obtener los archivos:', error);
      }
    });
  }

  //PRUEBAS DE SELECTOR DE ARCHIVOS POR NOMBRE

  // Método que maneja la carga del archivo
  loadFileData(fileName: string): void {
    const payload = { fileName };
    console.log('Payload enviado:', payload);

    this.http.get<any[]>(`${this.configService.apiUrl}/genomeQuery/genomes`, { params: payload }).subscribe(
      (response) => {
        console.log('Respuesta del backend:', response);
        this.filesFetched.emit({ response, fileName: fileName }); // Emitir datos recibidos y el nombre del archivo
      },
      (error) => console.error('Error al cargar archivo:', error)
    );
  }

  // Método que abre el selector de archivos
  openFileSelector(): void {
    this.http.get<any[]>(`${this.configService.apiUrl}/file/processed_file`).subscribe(
      (files) => {
        // Filtrar solo los archivos con status 'processed'
        const processedFiles = files.filter(file => file.status === 'processed');
  
        if (processedFiles.length === 0) {
          alert('No hay archivos procesados disponibles.');
          return;
        }
  
        // Abre el modal y pasa solo los archivos procesados
        const dialogRef = this.dialog.open(FileSelectorComponent, {
          data: { files: processedFiles }, // Solo los archivos filtrados
          
        });console.log("Archivos procesados enviados al modal:", processedFiles);
  
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadFileData(result); // Pasar el nombre del archivo seleccionado
            console.log("Filename", result)
          }
        });
      },
      (error) => {
        console.error('Error al obtener archivos:', error);
        alert('Hubo un problema al obtener los archivos. Inténtalo nuevamente.');
      }
    );
  }
  


}
