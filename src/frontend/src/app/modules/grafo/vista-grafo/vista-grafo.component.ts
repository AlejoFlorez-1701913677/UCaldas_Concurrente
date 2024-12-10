import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-vista-grafo',
  templateUrl: './vista-grafo.component.html',
  styleUrls: ['./vista-grafo.component.css']
})

export class VistaGrafoComponent implements OnChanges {
  @Input() fileContent: string | null = null;  // Contenido del archivo recibido
  tableData: Array<Record<string, string>> = [];
  columns: string[] = [];

  constructor(private fileUploadService: FileUploadService) {} // Inyectamos el servicio

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileContent'] && this.fileContent) {
      if (this.isJsonFile(this.fileContent)) {
        this.parseJsonFile(this.fileContent);
        console.log('Datos JSON:', this.tableData);
        console.log(this.fileContent)
      } else {
        this.parseVcfFile(this.fileContent);
      }
    }
  }

  isJsonFile(content: string): boolean {
    try {
      JSON.parse(content);
      return true;
    } catch (e) {
      return false;
    }
  }

  parseJsonFile(content: string): void {
    const jsonData = JSON.parse(content);
    if (Array.isArray(jsonData) && jsonData.length > 0) {
      this.columns = Object.keys(jsonData[0]);
      this.tableData = jsonData;
    } else {
      console.error('El archivo JSON no tiene el formato esperado');
    }
  }

  parseVcfFile(content: string): void {
    const lines = content.split('\n');
    this.columns = lines[0].split('\t'); // Asume que los encabezados están en la primera línea y separados por tabulaciones
    this.tableData = lines.slice(1).map(line => {
      const values = line.split('\t');
      const row: Record<string, string> = {};
      this.columns.forEach((col, index) => {
        row[col] = values[index] || '';
      });
      return row;
    });
  }

  // Método para manejar el archivo cargado desde el side-menu
  onFileLoad(file: File): void {
    this.fileUploadService.readFile(file).subscribe(
      (content) => {
        this.fileContent = content;
      },
      (error) => {
        console.error('Error al cargar el archivo:', error);
      }
    );
  }
}
