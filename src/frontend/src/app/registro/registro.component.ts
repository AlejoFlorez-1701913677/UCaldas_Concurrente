import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigServiceService } from '../services/config-service.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private configService: ConfigServiceService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      console.log('Formulario válido, datos:', this.registerForm.value);
      // Procesar datos del formulario aquí
      this.http.post(`${this.configService.apiUrl}/User/register`, { username, email, password })
      .subscribe({
        next: (response: any) => {
          // Suponiendo que el backend devuelve un token en la respuesta
          if (response && response.access_token) {
            this.router.navigate(['/login']); // Redirige al login
          }
        },
        error: (error) => {
          console.error('Error de registro:', error);
          this.errorMessage = 'Correo o contraseña incorrectos'; // Manejo de error
        }
      });
  } else {
    this.errorMessage = 'Por favor completa todos los campos correctamente';
  }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
