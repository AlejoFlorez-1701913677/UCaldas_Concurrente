import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfigServiceService } from 'src/app/services/config-service.service';


@Component({
  selector: 'app-vista-grafo',
  templateUrl: './vista-tabla.component.html',
  styleUrls: ['./vista-tabla.component.css']
})
export class VistaGrafoComponent implements OnChanges, OnInit {
  @Input() fileContent: any[] = [];
  filteredData: any[] = []; // Datos filtrados y paginados
  paginatedData: any[] = [];
  columns: string[] = [];
  filters: { [key: string]: string } = {};
  showDropdown: { [key: string]: boolean } = {};
  rowsPerPage = 10;
  currentPage = 1;
  showData: boolean = false;

  filterForm: FormGroup;

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private configService: ConfigServiceService) {
    this.filterForm = this.fb.group({
      CHROM: [''],
      FILTER: [''],
      INFO: [''],
      FORMAT: [''],
      LIMIT: [this.rowsPerPage],
      OFFSET: []
    });
  }


  ngOnInit(): void {
    this.loadInitialData();
    this.filteredData = [...this.fileContent];
    this.updatePaginatedData();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileContent'] && this.fileContent) {
      this.columns = Object.keys(this.fileContent[0] || {}); // Extrae columnas dinámicas
      this.filteredData = [...this.fileContent]; // Inicializar con todos los datos
      //this.updatePaginatedData();
    }
  }



  loadInitialData(): void {
    this.http.get<any[]>(`${this.configService.apiUrl}/genomeQuery/genomes`).subscribe({
      next: (response) => {
        this.filteredData = response;
        this.currentPage = 1; // Reinicia la página
        this.updatePaginatedData(); // Actualiza los datos de la tabla
        this.showData = true;
      },
      error: (err) => console.error('Error al cargar los datos iniciales:', err),
    });
  }
  

  updatePaginatedData(): void {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedData = this.filteredData.slice(start, end);
    //console.log("Tamaño filtereData ", this.filteredData.length)
  }

  getIndex(index: number): number {
    return (this.currentPage - 1) * this.rowsPerPage + index + 1;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData(); // Actualiza la tabla después de cambiar la página
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPageCount) {
      this.currentPage++;
      this.updatePaginatedData(); // Actualiza la tabla después de cambiar la página
    }
  }

  get totalPageCount(): number {
    return Math.ceil(this.filteredData.length / this.rowsPerPage);
  }

  applyFilters(): void {
    const formData = this.filterForm.value;
  
    if (!formData.CHROM && !formData.FILTER && !formData.INFO && !formData.FORMAT) {
      this.loadInitialData(); // Cargar todos los datos si no hay filtros
      return;
    }
  
    const params: any = {
      limit: formData.LIMIT || this.rowsPerPage,
      offset: 0  // Reinicia el desplazamiento al aplicar filtros
    };
  
    if (formData.CHROM) params.chrom = formData.CHROM;
    if (formData.FILTER) params.filter = formData.FILTER;
    if (formData.INFO) params.info = formData.INFO;
    if (formData.FORMAT) params.format = formData.FORMAT;
  
    this.http.get<any[]>(`${this.configService.apiUrl}/genomeQuery/genomes`, { params }).subscribe({
      next: (response) => {
        this.filteredData = response;
        this.paginatedData = []; // Limpia la tabla existente
        this.currentPage = 1; // Reinicia la página
        console.log("Respuesta filtro", response)
        this.updatePaginatedData(); // Actualiza la tabla con los nuevos datos
      },
      error: (err) => console.error('Error al filtrar:', err),
    });
  }
  




  getUniqueValues(column: string): any[] {
    return [...new Set(this.fileContent.map(row => row[column]))];
  }

  onFilterChange(value: string, column: string): void {
    this.filters[column] = value;
    this.applyFilters();
  }









  // Toggle para abrir/cerrar el dropdown
  toggleDropdown(column: string): void {
    this.showDropdown[column] = !this.showDropdown[column];
  }
}

