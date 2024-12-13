import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfigServiceService } from 'src/app/services/config-service.service';


@Component({
  selector: 'app-vista-grafo',
  templateUrl: './vista-grafo.component.html',
  styleUrls: ['./vista-grafo.component.css']
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

  filterForm: FormGroup;

  constructor(private fb: FormBuilder, 
    private http: HttpClient, 
    private configService: ConfigServiceService) {
    this.filterForm = this.fb.group({
      column: [''],
      pos_start: [0],
      pos_end: [10],
    });
   }


  ngOnInit(): void {
    this.filteredData = [...this.fileContent];
    this.updatePaginatedData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileContent'] && this.fileContent) {
      this.columns = Object.keys(this.fileContent[0] || {}); // Extrae columnas dinámicas
      this.filteredData = [...this.fileContent]; // Inicializar con todos los datos
      this.updatePaginatedData();
    }
  }

  updatePaginatedData(): void {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedData = this.filteredData.slice(start, end);
  }

  getIndex(index: number): number {
    return (this.currentPage - 1) * this.rowsPerPage + index + 1;
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

  applyFilters(): void {
    const formData = this.filterForm.value;
    const params: any = {
      limit: this.rowsPerPage,
    };

    if (formData.column) params.chrom = formData.column;
    if (formData.pos_start) params.pos_start = formData.pos_start;
    if (formData.pos_end) params.pos_end = formData.pos_end;

    this.http.get<any[]>(`${this.configService.apiUrl}/genomeQuery/genomes`, { params }).subscribe({
      next: (response) => {
        this.filteredData = response;
        this.currentPage = 1;
        this.updatePaginatedData();
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

