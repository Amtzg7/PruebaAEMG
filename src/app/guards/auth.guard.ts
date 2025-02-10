import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, CanActivateFn } from '@angular/router';

import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
// @Injectable({
//   providedIn: 'root'
// })
// export class authGuard implements CanActivate {
  
//   private router = inject(Router);

//   canActivate(): boolean {
//     const token = localStorage.getItem("token");
    
//     if (token) {
//       return true; // Permitir acceso
//     } else {
//       this.router.navigate(['/login']); // Redirigir si no hay token
//       return false;
//     }
//   }
// }
export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem("token") || "";
  const router = inject(Router);

  const accesoService = inject(AuthService)
  if(token != ""){
       return accesoService.validarToken(token).pipe(
            map(data => {
                 if(data.respuesta){
                      return true
                 } else{
                      router.navigate([''])
                      return false;
                 }
            }),
            catchError(error => {
                 router.navigate([''])
                      return of(false);
            })
       )
  }else {
       router.navigateByUrl("");
       return false
  }
};