import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigServiceService } from '../services/config-service.service';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private http: HttpClient, 
    private configService: ConfigServiceService,
    private popupService: PopupService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      // Procesar datos del formulario aquí
      this.http.post(`${this.configService.apiUrl}/User/register`, { username, email, password })
        .subscribe({
          next: (response: any) => {
            console.log("access_key",response)
            // backend devuelve un token en la respuesta
            if (response) {
              console.log('Registro exitoso')
              this.popupService.showMessage('Registro exitoso, la llave de acceso fue enviada a su correo electrónico', true).subscribe(() => {
                this.router.navigate(['/login']);
              });
            }
          },
          error: (error) => {
            this.popupService.showMessage('Hubo un error al intentar registrarse. Intente nuevamente.', false);
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
