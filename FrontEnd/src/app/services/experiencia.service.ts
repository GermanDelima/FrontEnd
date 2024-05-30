import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Experiencia } from '../models/experiencia';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaService {
  private apiServerURL = environment.apiBaseURL;
  
  constructor(private http: HttpClient) { }

  public getExperiencia(): Observable<Experiencia[]> {
    return this.http.get<Experiencia[]>(`${this.apiServerURL}/api/experiencia/traer/experiencia`);
  }

  public addExperiencia(experiencia: Experiencia): Observable<Experiencia> {
    return this.http.post<Experiencia>(`${this.apiServerURL}/api/experiencia/crear/experiencia`, experiencia);
  }

  public updateExperiencia(experiencia: Experiencia): Observable<Experiencia> {
    return this.http.put<Experiencia>(`${this.apiServerURL}/api/experiencia/editar/experiencia/${experiencia.id}`, experiencia);
  }

  public deleteExperiencia(experienciaId: number): Observable<Experiencia> {
    return this.http.delete<Experiencia>(`${this.apiServerURL}/api/experiencia/eliminar/experiencia/${experienciaId}`);
  }

}
