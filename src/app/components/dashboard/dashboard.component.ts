import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { appsettings } from '../../settings/app.settings';
import { Usuario } from '../../interfaces/Usuario';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  usuario: any = {};
  listaUsuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  page: number = 1;
  pageSize: number = 10;
  totalUsuarios: number = 0;

  nuevoUsuario: Usuario = {
    nombre: '',
    correo: '',
    contrasena: ''
  };
  filtroNombre: string = '';
  filtroCorreo: string = '';

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.obtenerListaUsuarios();
  }

  obtenerListaUsuarios(): void {
    const apiUrl = `${appsettings.apiUrl}lista?page=${this.page}&pageSize=${this.pageSize}`;
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.listaUsuarios = data;
          this.filtrarUsuarios();
        } else {
          console.error('Formato de respuesta inesperado:', data);
        }
      },
      error: (err) => {
        console.error('Error obteniendo la lista de usuarios', err);
      }
    });
  }

  filtrarUsuarios(): void {
    this.usuariosFiltrados = this.listaUsuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()) &&
      usuario.correo.toLowerCase().includes(this.filtroCorreo.toLowerCase())
    );
  }

  cambiarPagina(delta: number): void {
    const nuevaPagina = this.page + delta;
    if (nuevaPagina < 1) return;
    this.page = nuevaPagina;
    this.obtenerListaUsuarios();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  registrarUsuario(): void {
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.correo || !this.nuevoUsuario.contrasena) {
      alert('Por favor, complete todos los campos.');
      return;
    }
  
    this.authService.registrarse(this.nuevoUsuario).subscribe({
      next: (response) => {
        alert('Usuario registrado con éxito.');
        this.nuevoUsuario = { nombre: '', correo: '', contrasena: '' };
        this.obtenerListaUsuarios();
      },
      error: (err) => {
        alert('Error al registrar usuario.');
        console.error(err);
      }
    });
  }
}