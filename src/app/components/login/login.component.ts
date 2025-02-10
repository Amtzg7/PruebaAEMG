import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormsModule } from '@angular/forms'; 
import { Login } from '../../interfaces/Login';
import { ResponseAcceso } from '../../interfaces/ResponseAcceso';
import { DashboardComponent } from '../dashboard/dashboard.component';

import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  private formBuild = inject(FormBuilder);

  public formLogin: FormGroup = this.formBuild.group({
    correo: ['', Validators.required],
    contrasena: ['', Validators.required] 
  });

  public mensajeError: string = '';

  iniciarSesion() {
    if (this.formLogin.invalid) {
      this.mensajeError = "Rellenar ambos campos para continuar";
      alert(this.mensajeError);
      return;
    }
  
    const objeto: Login = {
      correo: this.formLogin.value.correo,
      contrasena: this.formLogin.value.contrasena
    };
  
    this.authService.login(objeto.correo, objeto.contrasena).subscribe({
      next: (data: ResponseAcceso) => {
        if (data?.token) {
          localStorage.setItem("token", data.token);
          this.router.navigate(['lista']);
        } else {
          this.mensajeError = "Credenciales incorrectas";
          alert(this.mensajeError);
        }
      },
      error: () => {
        this.mensajeError = "El usuario o la contraseña son incorrectos";
        alert(this.mensajeError);
      }
    });
  }

  registrarse() {
    this.router.navigate(['registro']);
  }
}