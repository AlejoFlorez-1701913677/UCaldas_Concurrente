import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ConfigServiceService } from 'src/app/services/config-service.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-vista-grafo',
  templateUrl: './vista-grafo.component.html',
  styleUrls: ['./vista-grafo.component.css']
})
export class VistaGrafoComponent implements OnChanges {
  @Input() fileContent: string | null = null;
  @Input() filesFetched = new EventEmitter<any>();
  @Output() fileLoaded = new EventEmitter<string>();
  @Input() files: any[] = [];

  tableData: Array<Record<string, string>> = [];
  columns: string[] = [];
  filters: Record<string, string | null> = {}; // Almacena el filtro para cada columna
  filteredData: Array<Record<string, string>> = []; // Almacena los datos filtrados
  showDropdown: Record<string, boolean> = {}; // Para controlar qué columna tiene el dropdown abierto


  constructor(
    private fileUploadService: FileUploadService,
    private http: HttpClient,
    private configService: ConfigServiceService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileContent'] && this.fileContent) {
      this.fileLoaded.emit(this.fileLoaded.name);
      if (this.isJsonFile(this.fileContent)) {
        this.parseJsonFile(this.fileContent);
      } else {
        this.parseVcfFile(this.fileContent);
      }
      // Inicializar los filtros con valores vacíos para cada columna
      this.columns.forEach(column => {
        if (!this.filters[column]) {
          this.filters[column] = ''; // Inicializa con un string vacío o null
        }
        // Inicializar el estado del dropdown como cerrado (false)
        this.showDropdown[column] = false;
      });
    }
  }

  fetchFiles(pos_start: number, limit: number): void {
    const pos_end = pos_start + limit;
    const url = `${this.configService.apiUrl}/genomeQuery/genomes?pos_start=${pos_start}&pos_end=${pos_end}&limit=${limit}`;

    this.http.get<any[]>(url).subscribe({
      next: (files) => {
        this.tableData = files; // Asignar datos obtenidos a tableData
        this.filteredData = files; // Inicializar datos filtrados
        this.columns = files.length ? Object.keys(files[0]) : []; // Configurar columnas dinámicamente
        this.filesFetched.emit(files);
        console.log('Archivos obtenidos con paginación:', files);
        this.filesFetched.emit(files); // Emitir los archivos
      },
      error: (error) => {
        console.error('Error al obtener los archivos con paginación:', error);
      }
    });
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
    this.filteredData = jsonData; // Inicializamos los datos filtrados con todos los datos
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
    this.filteredData = this.tableData; // Inicializamos los datos filtrados
  }

  // Toggle para abrir/cerrar el dropdown
  toggleDropdown(column: string): void {
    this.showDropdown[column] = !this.showDropdown[column];
  }

  // Asigna el valor seleccionado del dropdown al filtro de la columna
  selectFilterValue(column: string, value: string): void {
    this.filters[column] = value;
    this.applyFilters(); // Aplica el filtro inmediatamente después de seleccionar el valor
    this.showDropdown[column] = false; // Cierra el dropdown después de seleccionar
  }

  // Obtiene los valores únicos de una columna para el filtro
  getUniqueValues(column: string): string[] {
    const values = this.tableData.map(row => row[column]);
    return Array.from(new Set(values)); // Eliminamos duplicados
  }

  // Función para aplicar los filtros seleccionados
  applyFilters(): void {
    this.filteredData = this.tableData.filter(row => {
      return this.columns.every(column => {
        const filterValue = this.filters[column];
        return !filterValue || row[column] === filterValue;
      });
    });
  }



  onFilterChange(event: string, column: string): void {
    this.filters[column] = event;
    this.applyFilters();
  }

  handleFetchedFiles(files: any[]): void {
    this.columns = Object.keys(files[0]); // Extraer columnas dinámicamente
    this.tableData = files; // Almacenar los datos para la tabla
    this.filteredData = files; // Inicializar datos filtrados
    console.log('Datos recibidos:', this.tableData);
  }
  



  // Paginación 
  rowsPerPage: number = 10;
  currentPage: number = 1;

  loadPage(page: number): void {
    const pos_start = (page - 1) * this.rowsPerPage;
    this.fetchFiles(pos_start, this.rowsPerPage);
    this.currentPage = page;
  }

  get paginatedData(): Array<Record<string, string>> {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const paginated = this.filteredData.slice(start, start + this.rowsPerPage);
    return paginated;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    const totalPages = Math.ceil(this.filteredData.length / this.rowsPerPage);
    if (this.currentPage < totalPages) {
      this.loadPage(this.currentPage + 1);
    }
  }

  get pageNumbers(): number[] {
    return Array.from({ length: Math.ceil(this.filteredData.length / this.rowsPerPage) }, (_, i) => i + 1);
  }


  getIndex(rowIndex: number): number {
    // Devuelve el índice con base en la página actual
    return (this.currentPage - 1) * this.rowsPerPage + rowIndex + 1;
  }

}
