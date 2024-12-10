import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = ''; //mensaje de error si falla la autenticación

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
  
      // Simulación de autenticación
      if (email === 'admin@test.com' && password === 'password123') {
        localStorage.setItem('token', 'fake-jwt-token'); // Almacena un token simulado
        this.router.navigate(['/home']); // Redirige al inicio
        console.log('Inicio de sesión correcto')
      } else {
        this.errorMessage = 'Correo o contraseña incorrectos';
        console.log('Inicio de sesión fallido')
      }
    }
  }
  
}
