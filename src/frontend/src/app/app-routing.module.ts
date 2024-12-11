import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { AuthGuard } from './auth.guard';
import { VistaGrafoComponent } from './modules/grafo/vista-grafo/vista-grafo.component';
import { RegistroComponent } from './registro/registro.component';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: 'home', component: VistaGrafoComponent, canActivate: [AuthGuard] }, // Ruta protegida
  { path: 'login', component: LoginComponent }, // Login antes que las rutas genéricas
  { path: 'register', component: RegistroComponent }, // Register antes que las rutas genéricas
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirige raíz a home
  { path: '**', redirectTo: 'login', pathMatch: 'full' }, // Ruta de seguridad
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
