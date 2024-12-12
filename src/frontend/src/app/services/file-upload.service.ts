import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConfigServiceService } from './config-service.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient, private configService: ConfigServiceService) { }
/*
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
*/
readFile(file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post<any>(`${this.configService.apiUrl}/genoma/process_file`, formData, {
    responseType: 'json'
  }).pipe(
    map(response => {
      return response.text;
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('Error al cargar el archivo:', error);
      return throwError(() => error);
    })
  );
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
