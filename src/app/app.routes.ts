import { Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'lista', component: DashboardComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Ruta por defecto
  { path: '**', redirectTo: '/login' } // Ruta para manejar errores 404
];