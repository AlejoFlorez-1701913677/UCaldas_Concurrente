import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
    canActivate: [AuthGuard]
   },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige la ruta raíz a 'login'
  { path: 'login', component: LoginComponent }, // Ruta al componente Login
  // Agrega otras rutas aquí
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
