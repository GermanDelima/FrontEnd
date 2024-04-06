import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private apiServerURL = environment.apiBaseURL; //conecta a environment

  constructor(private http: HttpClient) { } //importamos
  
  //metodo para traer un user por id
  public getUser():Observable<Usuario>{
    return this.http.get<Usuario>(`${this.apiServerURL}/api/usuario/traer/perfil/1`)
  }

  //metodo para editar un user
  public updateUsuario(usuario: Usuario):Observable<Usuario>{
    return this.http.put<Usuario>(`${this.apiServerURL}/api/usuario/editar/perfil`,usuario);
  } 
}
