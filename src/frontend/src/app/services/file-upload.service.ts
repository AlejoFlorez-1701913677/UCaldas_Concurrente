import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/assets/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private uploadUrl = `${environment.apiUrl}/file/process_file`; // URL del backend donde se subirá el archivo
  private uploadUrl2 = `${environment.apiUrl}/fileV2/process_file`;
  constructor(private http: HttpClient) { }

  upload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data'
    });

    return this.http.post(this.uploadUrl, formData, { headers });
  }

  upload2(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data'
    });

    return this.http.post(this.uploadUrl2, formData, { headers });
  }

}
