import { Injectable } from '@angular/core';
import { environment } from 'src/assets/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigServiceService {
  apiUrl = environment.apiUrl;

  constructor() { }
}
