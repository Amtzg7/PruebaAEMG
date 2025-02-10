import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Usuario } from '../../interfaces/Usuario';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.name || !this.email || !this.password) {
      alert('Todos los campos son obligatorios');
      return;
    }
  
    const usuario: Usuario = {
      nombre: this.name,
      correo: this.email,
      contrasena: this.password
    };
  
    this.authService.registrarse(usuario).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        if (error.status === 409) {
          alert('El usuario ya existe');
        } else {
          console.error('Error en el registro', error);
          alert('Error en el registro');
        }
      }
    });
  }
}