import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigServiceService } from 'src/app/services/config-service.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = ''; //mensaje de error si falla la autenticación

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private configService: ConfigServiceService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      access_key: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password, access_key } = this.loginForm.value;
  
      // Realiza la solicitud al backend
      this.http.post(`${this.configService.apiUrl}/User/login`, { username, password, access_key })
        .subscribe({
          next: (response: any) => {
            // Suponiendo que el backend devuelve un token en la respuesta
            if (response && response.access_token) {
              localStorage.setItem('token', response.access_token); // Almacena el token en el localStorage
              this.router.navigate(['/home']); // Redirige al inicio
              console.log('Inicio de sesión exitoso');
            }
          },
          error: (error) => {
            console.error('Error de autenticación:', error);
            this.errorMessage = 'Correo o contraseña incorrectos'; // Manejo de error
          }
        });
    } else {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
    }
  }
  
  
}
