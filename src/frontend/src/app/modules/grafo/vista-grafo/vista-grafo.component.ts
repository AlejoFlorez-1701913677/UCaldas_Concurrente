import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-vista-grafo',
  templateUrl: './vista-grafo.component.html',
  styleUrls: ['./vista-grafo.component.css']
})
export class VistaGrafoComponent implements OnChanges {
  @Input() fileContent: any[] = [];
  //@Input() filesFetched = new EventEmitter<any>();
  //@Output() fileLoaded = new EventEmitter<string>();
  //@Input() files: any[] = [];

  filteredData: any[] = []; // Datos filtrados y paginados
  columns: string[] = [];
  filters: { [key: string]: string } = {};
  showDropdown: { [key: string]: boolean } = {};
  //tableData: Array<Record<string, string>> = [];
  rowsPerPage = 10;
  currentPage = 1;


  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileContent'] && this.fileContent) {
      this.columns = Object.keys(this.fileContent[0] || {}); // Extrae columnas dinámicas
      this.filteredData = [...this.fileContent]; // Inicializar con todos los datos
    }
  }

  getUniqueValues(column: string): any[] {
    return [...new Set(this.fileContent.map(row => row[column]))];
  }

  onFilterChange(value: string, column: string): void {
    this.filters[column] = value;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredData = this.fileContent.filter(row => {
      return this.columns.every(column => {
        const filterValue = this.filters[column];
        return filterValue ? row[column].includes(filterValue) : true;
      });
    });
    this.currentPage = 1; // Resetear a la primera página
  }

  getIndex(index: number): number {
    return (this.currentPage - 1) * this.rowsPerPage + index + 1;
  }

  get paginatedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    return this.filteredData.slice(startIndex, endIndex);
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPageCount) this.currentPage++;
  }

  get totalPageCount(): number {
    return Math.ceil(this.filteredData.length / this.rowsPerPage);
  }

  // Toggle para abrir/cerrar el dropdown
  toggleDropdown(column: string): void {
    this.showDropdown[column] = !this.showDropdown[column];
  }
}
/*
  // Asigna el valor seleccionado del dropdown al filtro de la columna
  selectFilterValue(column: string, value: string): void {
    this.filters[column] = value;
    this.applyFilters(); // Aplica el filtro inmediatamente después de seleccionar el valor
    this.showDropdown[column] = false; // Cierra el dropdown después de seleccionar
  }
*/
  /*
  get paginatedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredData.slice(startIndex, startIndex + this.rowsPerPage);
  }
*/

  /*
  initializeFilters(): void {
    this.columns.forEach(column => {
      if (!this.filters[column]) {
        this.filters[column] = ''; // Inicializa con un string vacío o null
      }
      this.showDropdown[column] = false; // Inicializar el estado del dropdown como cerrado (false)
    });
  }
*/

/*
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
*/



  

  

  // Obtiene los valores únicos de una columna para el filtro
  /*
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
*/

