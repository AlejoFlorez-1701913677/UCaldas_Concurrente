import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigServiceService } from './config-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 

  constructor(private http: HttpClient, private configService: ConfigServiceService) {}

  login(credentials: { email: string; password: string, key: string }): Observable<any> {
    return this.http.post(`${this.configService.apiUrl}/login`, credentials);
  }
}
