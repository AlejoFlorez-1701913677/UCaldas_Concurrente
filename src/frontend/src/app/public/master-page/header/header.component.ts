import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  openSubMenuArchivo: boolean = false;
  openSubMenuEditar: boolean = false;
  openSubMenuEjecutar: boolean = false;
  openSubMenuVentana: boolean = false;
  openSubMenuAyuda: boolean = false;
  isNuevoGrafoSelected: boolean = false;
  isExportarDatosSelected: boolean = false;
  isImportarDatosSelected: boolean = false;
  isNodoSelected: boolean = false;
  isArcoSelected: boolean = false;
  isNodoEditarSelected: boolean = false;
  isArcoEditarSelected: boolean = false;
  isProcesoSelected: boolean = false;






  toggleSubMenuArchivo(event: MouseEvent): void {
    this.closeAllSubMenus();
    this.openSubMenuArchivo = !this.openSubMenuArchivo;
    event.stopPropagation(); // Para evitar que el clic se propague al hacer clic dentro del submenú
  }

  closeSubMenuArchivo(): void {
    this.openSubMenuArchivo = false;
  }

  toggleSubMenuEditar(event: MouseEvent): void {
    this.closeAllSubMenus();
    this.openSubMenuEditar = !this.openSubMenuEditar;
    event.stopPropagation();
  }

  closeSubMenuEditar(): void {
    this.openSubMenuEditar = false;
  }

  toggleNuevoGrafoSubMenu(event: MouseEvent): void {
    this.closeAllSubSubMenus();
    this.isNuevoGrafoSelected = !this.isNuevoGrafoSelected;
    event.stopPropagation(); // Para evitar que el clic se propague al hacer clic dentro del submenú
  }

  closeNuevoGrafoSubMenu(): void {
    this.isNuevoGrafoSelected = false;
  }

  toggleEImportarDatosSubMenu(event: MouseEvent): void {
    this.closeAllSubSubMenus();
    this.isImportarDatosSelected = !this.isImportarDatosSelected;
    event.stopPropagation();

  }

  closeImportarDatosSubMenu(): void {
    this.isImportarDatosSelected = false;
  }

  toggleExportarDatosSubMenu(event: MouseEvent): void {
    this.closeAllSubSubMenus();
    this.isExportarDatosSelected = !this.isExportarDatosSelected;
    event.stopPropagation();
  }

  closeExportarDatosSubMenu(): void {
    this.isExportarDatosSelected = false;
  }

  toggleNodoEditarSubMenu(event: MouseEvent): void {
    this.isNodoEditarSelected = !this.isNodoEditarSelected;
    event.stopPropagation();
  }

  closeNodoEditarSubMenu(): void {
    this.isNodoEditarSelected = false;
  }

  toggleSubSubMenuNodo(event: MouseEvent): void {
    this.closeAllSubSubMenus();
    this.isNodoSelected = !this.isNodoSelected;
    event.stopPropagation();
  }

  closeNodoSubMenu(): void {
    this.isNodoSelected = false;
  }

  toogleSubSubMenuArco(event: MouseEvent): void {
    this.closeAllSubSubMenus();
    this.isArcoSelected = !this.isArcoSelected;
    event.stopPropagation();
  }

  closeArcoSubMenu(): void {
    this.isArcoSelected = false;
  }

  toggleArcoEditarSubMenu(event: MouseEvent): void {
    this.isArcoEditarSelected = !this.isArcoEditarSelected;
    event.stopPropagation();
  }

  closeArcoEditarSubMenu(): void {
    this.isArcoEditarSelected = false;
  }

  toggleSubMenuEjecutar(event: MouseEvent): void {
    this.closeAllSubMenus();
    this.openSubMenuEjecutar = !this.openSubMenuEjecutar;
    event.stopPropagation(); // Para evitar que el clic se propague al hacer clic dentro del submenú
  }

  closeSubMenuEjecutar(): void {
    this.openSubMenuEjecutar = false;
  }

  toogleSubSubMenuProceso(event: MouseEvent): void {
    this.closeAllSubSubMenus();
    this.isProcesoSelected = !this.isProcesoSelected;
    event.stopPropagation();
  }

  closeProcesoSubMenu(): void {
    this.isProcesoSelected = false;
  }

  toggleSubMenuVentana(event: MouseEvent): void {
    this.closeAllSubMenus();
    this.openSubMenuVentana = !this.openSubMenuVentana;
    event.stopPropagation(); // Para evitar que el clic se propague al hacer clic dentro del submenú
  }

  closeSubMenuVentana(): void {
    this.openSubMenuVentana = false;
  }

  toggleSubMenuAyuda(event: MouseEvent): void {
    this.closeAllSubMenus();
    this.openSubMenuAyuda = !this.openSubMenuAyuda;
    event.stopPropagation(); // Para evitar que el clic se propague al hacer clic dentro del submenú
  }

  closeSubMenuAyuda(): void {
    this.openSubMenuAyuda = false;
  }





  // si se da click en otro lugar cierra el submenu
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.relative')) {
      this.closeAllSubMenus();
      this.closeAllSubSubMenus();
    }
  }

  closeAllSubSubMenus(): void {
    this.closeNuevoGrafoSubMenu();
    this.closeExportarDatosSubMenu();
    this.closeImportarDatosSubMenu();
    this.closeNodoSubMenu();
    this.closeArcoSubMenu();
    this.closeNodoEditarSubMenu();
    this.closeArcoEditarSubMenu();
    this.closeProcesoSubMenu();
  }

  closeAllSubMenus(): void {
    this.closeAllSubSubMenus();
    this.closeSubMenuArchivo();
    this.closeSubMenuEditar();
    this.closeSubMenuEjecutar();
    this.closeSubMenuVentana();
    this.closeSubMenuAyuda();
  }

  onFileSelected(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    // Aquí puedes manejar el archivo seleccionado
    console.log('Archivo seleccionado:', file);
  }
}



