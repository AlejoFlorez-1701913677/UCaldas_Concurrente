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
  currentPage: number = 1;  // Página actual
  rowsPerPage: number = 10; // Filas por página

  constructor(private fileUploadService: FileUploadService) {} // Inyectamos el servicio

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileContent'] && this.fileContent) {
      if (this.isJsonFile(this.fileContent)) {
        this.parseJsonFile(this.fileContent);
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
    this.columns = Object.keys(jsonData[0]);
    this.tableData = jsonData;
    this.currentPage = 1; // Reiniciar la página cuando se cargue nuevo archivo
  }

  parseVcfFile(content: string): void {
    const lines = content.split('\n');
    this.columns = lines[0].split('\t');
    this.tableData = lines.slice(1).map(line => {
      const values = line.split('\t');
      const row: Record<string, string> = {};
      this.columns.forEach((col, index) => {
        row[col] = values[index] || '';
      });
      return row;
    });
    this.currentPage = 1; // Reiniciar la página cuando se cargue nuevo archivo
  }

   // Obtener filas visibles de la página actual
   get paginatedData(): Array<Record<string, string>> {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    return this.tableData.slice(startIndex, endIndex);
  }

  // Navegar a la página siguiente
  nextPage(): void {
    if (this.currentPage * this.rowsPerPage < this.tableData.length) {
      this.currentPage++;
    }
  }

  // Navegar a la página anterior
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Obtener el rango de páginas
  get pageNumbers(): number[] {
    const totalPages = Math.ceil(this.tableData.length / this.rowsPerPage);
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
}
