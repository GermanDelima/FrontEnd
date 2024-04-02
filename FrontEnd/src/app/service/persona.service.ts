import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { persona } from '../models/persona.models';


@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  URL = 'http://localhost:8080/api/persona/';
  
  constructor(private http: HttpClient) { } 

  public getPersona(): Observable<persona[]> { 
    return this.http.get<persona[]>(this.URL + 'traer/perfil'); 
  }
}
