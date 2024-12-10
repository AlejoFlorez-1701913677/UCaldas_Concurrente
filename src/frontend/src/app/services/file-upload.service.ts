import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  readFile(file: File): Observable<string> {
    return new Observable<string>((observer) => {
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        const content = e.target.result;
        if (file.name.endsWith('.vcf')) {
          // Procesar archivo VCF
          const vcfContent = this.parseVcf(content);
          observer.next(vcfContent);  // Emitir contenido procesado
        } else if (file.name.endsWith('.json')) {
          // Procesar archivo JSON
          observer.next(content);  // Emitir contenido JSON
        } else {
          observer.error('Tipo de archivo no soportado');
        }
        observer.complete();
      };

      reader.onerror = (err) => {
        observer.error('Error al leer el archivo');
      };
      
      reader.readAsText(file);  // Lee el archivo como texto
    });
  }

  // Función para procesar el contenido de un archivo VCF
private parseVcf(content: string): string {
  const lines = content.split('\n');
  const headers: string[] = [];  // Declara headers como un arreglo de cadenas
  const data: any[] = [];

  lines.forEach(line => {
    if (line.startsWith('#')) {
      // Línea de encabezado, la podemos ignorar o procesar
      headers.push(line);
    } else {
      // Línea de datos
      const columns = line.split('\t');
      data.push(columns);
    }
  });

  return JSON.stringify({ headers, data }); // Devuelvo como JSON para integrarlo en la tabla
}
}
