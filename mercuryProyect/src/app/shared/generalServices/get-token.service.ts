import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import * as jwtDecode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class GetTokenService {

  constructor(private cookieService: CookieService, private router: Router) { }

  getToken(){
    /*const token = this.cookieService.get('token');
    if (!token) {
      Swal.fire({
        title: "Token Vencido",
        text: "Por favor inicie sesión nuevamente.",
        icon: "warning"
      });
      this.router.navigate(['/login']);
      
    }

    const decodedToken: any = jwtDecode.jwtDecode(token);
    const isExpired = decodedToken.exp * 1000 < Date.now();

    if (isExpired) {
      Swal.fire({
        title: "Token Expirado",
        text: "Por favor inicie sesión nuevamente.",
        icon: "warning"
      });
      this.router.navigate(['/login']);
    }*/
    return {
      sub: '11',
      role: 'artist'
    }
  }
}
