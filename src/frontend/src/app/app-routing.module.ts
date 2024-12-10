import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { AuthGuard } from './auth.guard';
import { VistaGrafoComponent } from './modules/grafo/vista-grafo/vista-grafo.component';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: 'home', component: VistaGrafoComponent, canActivate: [AuthGuard] }, // Ruta para la página principal
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirige la ruta raíz a 'home' después de login
  { path: '**', redirectTo: 'login', pathMatch: 'full' }, // Ruta de seguridad si no se encuentra
  { path: 'login', component: LoginComponent }, // Ruta al componente Login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
